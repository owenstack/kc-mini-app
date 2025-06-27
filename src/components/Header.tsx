import { telegramAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { initDataState, useSignal } from "@telegram-apps/sdk-react";
import { toast } from "sonner";

export default function Header() {
	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user"],
		queryFn: () => telegramAuth.getCurrentUser(),
		enabled: telegramAuth.isAuthenticated(),
		retry: 2,
		retryDelay: 1000,
	});
	const tgData = useSignal(initDataState);
	const telegramUser = tgData?.user;

	if (error) {
		toast.error("Failed to load user data from backend", {
			description: "Using Telegram data instead",
		});
	}

	// Use backend data if available, otherwise fallback to Telegram data
	const displayUser = user || {
		firstName: telegramUser?.first_name || "User",
		lastName: telegramUser?.last_name || null,
		username: telegramUser?.username || null,
		balance: 0,
	};

	const userProfileImage = telegramUser?.photo_url;

	return (
		<header className="bg-card border-b border-border shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<nav className="flex space-x-6">
						<Link
							to="/"
							className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
							activeProps={{
								className: "text-primary font-semibold",
							}}
						>
							Home
						</Link>
						<Link
							to="/demo/tanstack-query"
							className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
							activeProps={{
								className: "text-primary font-semibold",
							}}
						>
							Demo
						</Link>
					</nav>

					<div className="flex items-center space-x-4">
						{isLoading ? (
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
								<div className="w-20 h-4 bg-muted rounded animate-pulse" />
							</div>
						) : telegramUser ? (
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-2">
									{userProfileImage ? (
										<img
											src={userProfileImage}
											alt={`${displayUser.firstName}'s avatar`}
											className="w-8 h-8 rounded-full ring-2 ring-border"
										/>
									) : (
										<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
											{displayUser.firstName.charAt(0).toUpperCase()}
										</div>
									)}
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">
											{displayUser.firstName} {displayUser.lastName || ""}
										</span>
										{displayUser.username && (
											<span className="text-xs text-muted-foreground">
												@{displayUser.username}
											</span>
										)}
									</div>
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
								{error && (
									<div
										className="w-2 h-2 bg-destructive rounded-full animate-pulse"
										title="Backend connection issue"
									/>
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
