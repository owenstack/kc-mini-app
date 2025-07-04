import { BalanceCard } from "@/components/main/balance-card";
import { LiveChart } from "@/components/main/live-chart";
import { MultiplierCard } from "@/components/main/multiplier-card";
import { Page } from "@/components/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<Page>
			<div className="flex flex-col items-center gap-4">
				<BalanceCard />
				<LiveChart />
				<MultiplierCard />
			</div>
		</Page>
	);
}
