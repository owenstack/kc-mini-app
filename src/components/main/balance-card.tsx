import { useStore } from "@/lib/store";
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
	const { user } = useStore();

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
							onClick={() => {}}
							disabled
						>
							<RefreshCw className="size-4" />
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
