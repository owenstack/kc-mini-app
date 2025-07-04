import Telegram from "@/assets/icons";
import { Page } from "@/components/page";
import { Preferences } from "@/components/settings/preferences";
import { UpdateUser } from "@/components/settings/update-user";
import { UpdateWallet } from "@/components/settings/update-wallet";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { initDataState, useSignal } from "@telegram-apps/sdk-react";

export const Route = createFileRoute("/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const tgData = useSignal(initDataState);
	return (
		<Page back>
			<div className="container mx-auto flex flex-col items-center py-8 space-y-6">
				<h1 className="text-3xl text-secondary font-semibold">
					Account Settings
				</h1>
				<UpdateUser />
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Telegram Details</CardTitle>
						<CardDescription>
							Manage your Telegram account connection
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<Telegram className="size-6" />
								<div>
									<p className="font-medium">Connected to Telegram</p>
									<p className="text-sm text-secondary">
										@{tgData?.user?.username}
									</p>
									{tgData?.user?.is_premium ? (
										<p>Telegram premium user</p>
									) : (
										<p>Not using Telegram premium</p>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<UpdateWallet />
				<Preferences />
			</div>
		</Page>
	);
}
