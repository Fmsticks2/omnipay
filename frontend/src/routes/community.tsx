import { createFileRoute } from "@tanstack/react-router";
import CommunityPage from "../pages/CommunityPage";

export const Route = createFileRoute("/community")({
	component: CommunityPage,
});
