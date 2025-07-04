import { Spinner } from "@/components/main/spinner";
import { DataTable } from "@/components/ui/data-table";
import { telegramAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

export function UserTable() {
	const { data } = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => telegramAuth.adminGetUsers(),
	});

	return (
		<div className="container mx-auto py-10 max-w-sm">
			{data ? <DataTable columns={columns} data={data} /> : <Spinner show />}
		</div>
	);
}
