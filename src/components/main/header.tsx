import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { initDataState, useSignal } from "@telegram-apps/sdk-react";
import { Settings, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Share } from "./share";
import { Logo } from "./logo";

export default function Header() {
	const { user } = useStore();
	const tgData = useSignal(initDataState);
	const telegramUser = tgData?.user;

	// Use backend data if available, otherwise fallback to Telegram data
	const displayUser = user || {
		firstName: telegramUser?.first_name || "User",
		lastName: telegramUser?.last_name || null,
		username: telegramUser?.username || null,
		balance: 0,
	};

	const userProfileImage = telegramUser?.photo_url;

	return (
		<header className="bg-card border-b border-border shadow-sm top-0 z-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Logo />
					<div className="flex items-center space-x-4">
						{telegramUser ? (
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-2">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="relative size-8 rounded-full"
											>
												<Avatar className="size-8">
													<AvatarImage
														src={userProfileImage ?? ""}
														alt={displayUser.firstName}
													/>
													<AvatarFallback>
														{displayUser.firstName?.[0]?.toUpperCase()}
													</AvatarFallback>
												</Avatar>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<div className="flex items-center justify-start gap-2 p-2">
												<div className="flex flex-col space-y-1 leading-none">
													{displayUser.firstName && (
														<p className="font-medium">
															{displayUser.firstName}
														</p>
													)}
													{displayUser.username && (
														<p className="w-[200px] truncate text-sm text-muted-foreground">
															@{displayUser.username}
														</p>
													)}
												</div>
											</div>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link
													to="/settings"
													className="flex w-full items-center gap-2 text-sm"
												>
													<Settings className="size-4" />
													Settings
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Share
													variant="secondary"
													className="w-full gap-2 text-sm"
												>
													<Share2 className="size-4" /> Share
												</Share>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								{user && (
									<div className="flex items-center space-x-1 bg-secondary px-3 py-1 rounded-full">
										<span className="text-xs font-medium text-secondary-foreground">
											Balance:
										</span>
										<span className="text-xs font-bold text-primary">
											${displayUser.balance.toLocaleString()}
										</span>
									</div>
								)}
							</div>
						) : (
							<div className="text-sm text-muted-foreground">
								Not authenticated
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
