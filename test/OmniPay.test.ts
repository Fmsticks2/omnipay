import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("OmniPay", function () {
  async function deployAll() {
    const [deployer, payer, payee, merchant] = await ethers.getSigners();

    const Notifier = await ethers.getContractFactory("OmniPayNotifier");
    const notifier = await Notifier.deploy(ethers.ZeroAddress, ethers.ZeroAddress);

    const Core = await ethers.getContractFactory("OmniPayCore");
    const core = await Core.deploy(await notifier.getAddress());

    const Sub = await ethers.getContractFactory("OmniPaySubscription");
    const subscription = await Sub.deploy(await notifier.getAddress());

    return { deployer, payer, payee, merchant, notifier, core, subscription };
  }

  it("handles ETH payment and records transaction", async function () {
    const { payer, payee, core } = await deployAll();
    const amount = ethers.parseEther("0.05");
    const before = await ethers.provider.getBalance(payee.address);
    const tx = await core.connect(payer).payETH(payee.address, "order-123", { value: amount });
    await tx.wait();
    const after = await ethers.provider.getBalance(payee.address);
    expect(after - before).to.equal(amount);
    expect(await core.transactionCount()).to.equal(1n);
  });

  it("handles ERC20 payment", async function () {
    const { payer, payee, core } = await deployAll();
    const Token = await ethers.getContractFactory("TestERC20");
    const token = await Token.deploy("TestUSD", "TUSD");
    const amount = ethers.parseUnits("100", 18);
    await token.mint(payer.address, amount);
    await token.connect(payer).approve(await core.getAddress(), amount);
    await expect(core.connect(payer).payERC20(token, payee.address, amount, "order-erc20"))
      .to.emit(core, "PaymentCompleted");
    expect(await token.balanceOf(payee.address)).to.equal(amount);
  });

  it("creates and executes ETH subscription, then cancels", async function () {
    const { payer, merchant, subscription } = await deployAll();
    const amount = ethers.parseEther("0.02");
    const interval = 60; // seconds
    const idTx = await subscription.connect(payer).createSubscription(merchant.address, ethers.ZeroAddress, amount, interval);
    const idReceipt = await idTx.wait();
    const createdEvent = idReceipt!.logs.find((l: any) => (l as any).fragment?.name === "SubscriptionCreated");
    const id = createdEvent ? (createdEvent as any).args[0] : 1n; // fallback

    await time.increase(interval + 1);
    await expect(subscription.connect(payer).executeSubscription(id, { value: amount }))
      .to.emit(subscription, "SubscriptionExecuted");

    await expect(subscription.connect(payer).cancelSubscription(id))
      .to.emit(subscription, "SubscriptionCancelled");
  });
});