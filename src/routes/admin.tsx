import { UserTable } from "@/components/admin/user-table";
import { useStore } from "@/lib/store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminPage,
});

function AdminPage() {
	const { user } = useStore();
	if (user?.role !== "admin") {
		redirect({ to: "/" });
	}
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
			<UserTable />
		</div>
	);
}
