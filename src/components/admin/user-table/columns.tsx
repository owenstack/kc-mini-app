import { UpdateUser } from "@/components/admin/update-user";
import { Dollar } from "@/components/main/dollar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { zodUser } from "@/lib/constants";
import { useStore } from "@/lib/store";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import type { z } from "zod";

export const columns: ColumnDef<z.infer<typeof zodUser>>[] = [
	{
		accessorKey: "image",
		header: "User",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-4">
					<Avatar>
						<AvatarImage src={user.image ?? ""} alt={user.firstName} />
						<AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{user.firstName}</span>
						<span className="text-sm text-muted-foreground">
							@{user.username}
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "balance",
		header: "Balance",
		cell: ({ row }) => <Dollar value={row.original.balance} />,
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { updateUser } = useStore();
			const handleDelete = async () => {
				try {
					// In a real app, you'd probably want to soft delete or handle this differently
					updateUser({
						id: "",
						telegramId: "",
						username: "",
						balance: 0,
						multiplier: 0,
					});
					toast.success("User deleted successfully");
				} catch (error) {
					toast.error("Failed to delete user", {
						description:
							error instanceof Error ? error.message : "Internal server error",
					});
				}
			};

			return <UpdateUser user={row.original} onDelete={handleDelete} />;
		},
	},
];
