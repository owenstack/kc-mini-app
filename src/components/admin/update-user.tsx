import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { telegramAuth } from "@/lib/auth";
import type { zodUser } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UpdateUserProps {
	user: z.infer<typeof zodUser>;
	onDelete: () => Promise<void>;
}

export function UpdateUser({ user, onDelete }: UpdateUserProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;
		const role = formData.get("role") as "user" | "admin";
		const balance = Number(formData.get("balance"));
		const { mutateAsync } = useMutation({
			mutationKey: ["updateUser", user.id],
			mutationFn: async () =>
				telegramAuth.adminUpdateUser({
					userId: user.id,
					username,
					role,
					balance,
				}),
		});

		try {
			const data = await mutateAsync();
			if (!data) {
				throw new Error("Failed to update user");
			}
			toast.success("User updated successfully");
			setOpen(false);
		} catch (error) {
			toast.error("Failed to update user", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="ghost" size="icon">
						<Pencil className="size-4" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit user</DialogTitle>
						<DialogDescription>
							Make changes to the user's profile here. Click save when you're
							done.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								name="username"
								defaultValue={user.username ?? ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Select name="role" defaultValue={user.role}>
								<SelectTrigger>
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="balance">Balance</Label>
							<Input
								type="number"
								id="balance"
								name="balance"
								defaultValue={user.balance}
							/>
						</div>
						<div className="flex justify-end">
							<Button type="submit">Save changes</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="ghost" size="icon">
						<Trash className="size-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user's account and remove their data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
