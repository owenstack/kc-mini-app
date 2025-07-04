import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { type DataPoint, getSimulatedData } from "@/lib/simulation";
import { useStore } from "@/lib/store";
import { TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function LiveChart() {
	const [chartData, setChartData] = useState<DataPoint[]>([]);
	const { activeBoosters } = useStore();

	useEffect(() => {
		const interval = setInterval(async () => {
			const newData = await getSimulatedData("mev", 1);
			setChartData((prevData) => [...prevData.slice(-99), ...newData]);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const formatTimestamp = (timestamp: number) => {
		return new Date(timestamp).toLocaleTimeString();
	};

	const formatValue = (value: number) => {
		return `${value.toFixed(2)}`;
	};

	return (
		<Card className="h-[22rem] max-w-sm md:max-w-md md:h-[400px] mt-4 w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>MEV Bot Profit/Loss</CardTitle>
						<CardDescription>Real-time profit/loss tracking</CardDescription>
					</div>
					{activeBoosters && activeBoosters.length > 0 && (
						<Badge variant="secondary" className="flex items-center gap-1">
							<Zap className="h-3 w-3" />
							{activeBoosters.length} Active
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="timestamp"
							tickFormatter={formatTimestamp}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis
							tickFormatter={formatValue}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							labelFormatter={formatTimestamp}
							formatter={(value: number) => [formatValue(value), "Profit"]}
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Area
							type="natural"
							dataKey="value"
							stroke="var(--color-desktop)"
							fill="var(--color-desktop)"
							fillOpacity={0.2}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<span className="flex items-center gap-2 p-4 font-medium leading-none">
				Live MEV Bot Performance <TrendingUp className="h-4 w-4" />
			</span>
		</Card>
	);
}

const chartConfig = {
	desktop: {
		label: "Profit",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;
