// JavaScript version of deploy script
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${(await deployer.provider.getNetwork()).name}`);

  const PUSH_COMM = process.env.PUSH_COMM || hre.ethers.ZeroAddress;
  const PUSH_CHANNEL = process.env.PUSH_CHANNEL || hre.ethers.ZeroAddress;

  // Deploy Notifier
  const Notifier = await hre.ethers.getContractFactory("OmniPayNotifier");
  const notifier = await Notifier.deploy(PUSH_COMM, PUSH_CHANNEL);
  await notifier.waitForDeployment();
  console.log(`OmniPayNotifier: ${await notifier.getAddress()}`);

  // Deploy Core
  const Core = await hre.ethers.getContractFactory("OmniPayCore");
  const core = await Core.deploy(await notifier.getAddress());
  await core.waitForDeployment();
  console.log(`OmniPayCore: ${await core.getAddress()}`);

  // Deploy Subscription
  const Sub = await hre.ethers.getContractFactory("OmniPaySubscription");
  const subscription = await Sub.deploy(await notifier.getAddress());
  await subscription.waitForDeployment();
  console.log(`OmniPaySubscription: ${await subscription.getAddress()}`);

  // Deploy Bridge Stub
  const Bridge = await hre.ethers.getContractFactory("OmniPayBridgeStub");
  const bridge = await Bridge.deploy();
  await bridge.waitForDeployment();
  console.log(`OmniPayBridgeStub: ${await bridge.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});