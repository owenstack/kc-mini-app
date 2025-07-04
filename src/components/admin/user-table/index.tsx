import { Spinner } from "@/components/main/spinner";
import { DataTable } from "@/components/ui/data-table";
import { useStore } from "@/lib/store";
import { columns } from "./columns";

export function UserTable() {
	const { user } = useStore();

	return (
		<div className="container mx-auto py-10 max-w-sm">
			{user ? <DataTable columns={columns} data={[user]} /> : <Spinner show />}
		</div>
	);
}
