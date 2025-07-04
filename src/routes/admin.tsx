import { UserTable } from "@/components/admin/user-table";
import { telegramAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminPage,
});

function AdminPage() {
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: () => telegramAuth.getCurrentUser(),
	});
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
