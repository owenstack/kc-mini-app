import { useStore } from "@/lib/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/tanstack-query")({
	component: ZustandDemo,
});

function ZustandDemo() {
	const { user } = useStore();

	return (
		<div className="p-4">
			<h1 className="text-2xl mb-4">User Details</h1>
			{user ? (
				<ul>
					<li>ID: {user.id}</li>
					<li>Telegram ID: {user.telegramId}</li>
					<li>Username: {user.username}</li>
					<li>Balance: {user.balance}</li>
					<li>Multiplier: {user.multiplier}</li>
				</ul>
			) : (
				<p>No user data available.</p>
			)}
		</div>
	);
}
