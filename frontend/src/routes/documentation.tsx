import { createFileRoute } from "@tanstack/react-router";
import DocumentationPage from "../pages/DocumentationPage";

export const Route = createFileRoute("/documentation")({
	component: DocumentationPage,
});
