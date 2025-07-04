import { telegramAuth } from "@/lib/auth";
import { mnemonicClient } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ConnectKitButton } from "connectkit";
import { Loader2, Wallet2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LocalWalletDialog } from "./local-wallet-dialog";

export function UpdateWallet() {
	const { data: user, refetch } = useQuery({
		queryKey: ["user"],
		queryFn: async () => telegramAuth.getCurrentUser(),
	});
	const { mutateAsync } = useMutation({
		mutationKey: ["walletKitConnected"],
		mutationFn: async () =>
			telegramAuth.updateUser({ walletKitConnected: true }),
	});
	const { address } = useAccount();
	const [mnemonicAddress, setMnemonicAddress] = useState("");
	if (user?.mnemonic) {
		setMnemonicAddress(mnemonicClient(user.mnemonic).account.address);
	}
	const [notif, setNotif] = useState(false);
	const [tfa, setTfa] = useState(false);
	const [loading, setLoading] = useState(false);

	const changeNotif = () => {
		setLoading(true);
		setTimeout(() => {
			setNotif(true);
			toast.success("Updated successfully");
			setLoading(false);
		}, 2000);
	};
	const changeTfa = () => {
		setLoading(true);
		setTimeout(() => {
			setTfa(true);
			toast.success("Updated successfully");
			setLoading(false);
		}, 2000);
	};

	// const handleWalletConnect = async () => {
	// 	if (address) {
	// 		try {
	// 			await mutateAsync();
	// 			refetch();
	// 			toast.success("Wallet connected successfully");
	// 		} catch (error) {
	// 			toast.error("Failed to connect wallet");
	// 		}
	// 	}
	// };

	return (
		<Card className="w-full max-w-sm" id="wallet">
			<CardHeader>
				<CardTitle>Wallet Settings</CardTitle>
				<CardDescription>
					Manage your cryptocurrency wallet preferences
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				{!user?.walletKitConnected && !user?.mnemonic ? (
					<>
						<Tabs defaultValue="mnemonic">
							<TabsList>
								<TabsTrigger value="mnemonic">
									<Wallet2 className="size-4 mr-2" />
									Local wallet
								</TabsTrigger>
								<TabsTrigger value="connect">WalletConnect</TabsTrigger>
							</TabsList>
							<TabsContent value="mnemonic">
								<div>
									Set up your local wallet to continue
									<LocalWalletDialog />
								</div>
							</TabsContent>
							<TabsContent value="connect">
								<div>
									Connect to your existing wallet to continue
									<ConnectKitButton />
								</div>
							</TabsContent>
						</Tabs>
					</>
				) : (
					<div>
						{user?.walletKitConnected ? (
							<div className="flex  items-center justify-between">
								<div className="space-y-0.5">
									<Label>Default Wallet</Label>
									<ConnectKitButton showBalance showAvatar />
								</div>
							</div>
						) : (
							<div className="flex  items-center justify-between">
								<div className="space-y-0.5">
									<Label>Default Wallet</Label>
									<p className="text-sm text-gray-500">
										{mnemonicAddress.slice(0, 6)}...$
										{mnemonicAddress.slice(
											mnemonicAddress.length - 6,
											mnemonicAddress.length,
										)}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
				<Separator />
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						{loading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Switch
								defaultChecked={notif}
								onChange={changeNotif}
								id="notifications"
							/>
						)}
						<Label htmlFor="notifications">Transaction Notifications</Label>
					</div>
					<div className="flex items-center space-x-2">
						{loading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Switch defaultChecked={tfa} onChange={changeTfa} id="2fa" />
						)}
						<Label htmlFor="2fa">Two-Factor Authentication</Label>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
