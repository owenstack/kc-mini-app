import { Link } from "@tanstack/react-router";
import { telegramAuth } from "@/lib/auth";

export default function Header() {
	const user = telegramAuth.getCurrentUser();
	return (
		<header className="p-2 flex gap-2 bg-white text-black justify-between">
			<nav className="flex flex-row">
				<div className="px-2 font-bold">
					<Link to="/">Home</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/tanstack-query">TanStack Query</Link>
				</div>
			</nav>
		</header>
	);
}
