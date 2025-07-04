import { telegramAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Dollar } from "./dollar";
import { Withdraw } from "./withdraw-dialog";

export function BalanceCard() {
	const {
		data: user,
		isPending,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["user"],
		queryFn: () => telegramAuth.getCurrentUser(),
		refetchInterval: 10000, // Refetch every 10 seconds
		refetchOnWindowFocus: false,
		select: (data) => ({
			...data,
			balance: data.balance ?? 0, // Ensure balance is always a number
		}),
	});

	return (
		<Card className="w-full max-w-sm md:max-w-md">
			<CardHeader className="flex item-center justify-between">
				<div>
					<CardTitle className="text-4xl">
						<Dollar value={user?.balance ?? 0} />
					</CardTitle>
					<CardDescription className="flex items-center">
						Earned balance
						<Button
							variant="ghost"
							size={"icon"}
							className="ml-2"
							onClick={() => refetch()}
							disabled={isPending || isRefetching}
						>
							{isPending || isRefetching ? (
								<RefreshCw className="size-4 animate-spin" />
							) : (
								<RefreshCw className="size-4" />
							)}
						</Button>
					</CardDescription>
				</div>
				<CardAction>
					<Withdraw />
				</CardAction>
			</CardHeader>
		</Card>
	);
}
