import { createFileRoute } from "@tanstack/react-router";
import FaucetPage from "../pages/FaucetPage";

export const Route = createFileRoute("/faucet")({
	component: FaucetPage,
});
