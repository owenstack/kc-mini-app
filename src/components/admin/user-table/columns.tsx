import { UpdateUser } from "@/components/admin/update-user";
import { Dollar } from "@/components/main/dollar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { telegramAuth } from "@/lib/auth";
import type { zodUser } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
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
			const handleDelete = async () => {
				const { mutateAsync } = useMutation({
					mutationKey: ["delete-user", row.original.id],
					mutationFn: () =>
						telegramAuth.adminDeleteUser({ userId: row.original.id }),
				});
				try {
					const data = await mutateAsync();
					if (!data) {
						throw new Error("Failed to delete user");
					}
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
