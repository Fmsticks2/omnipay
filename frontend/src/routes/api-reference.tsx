import { createFileRoute } from "@tanstack/react-router";
import ApiReferencePage from "../pages/ApiReferencePage";

export const Route = createFileRoute("/api-reference")({
	component: ApiReferencePage,
});
