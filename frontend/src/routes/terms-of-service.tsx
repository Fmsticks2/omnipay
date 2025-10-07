import { createFileRoute } from "@tanstack/react-router";
import TermsOfServicePage from "../pages/TermsOfServicePage";

export const Route = createFileRoute("/terms-of-service")({
	component: TermsOfServicePage,
});
