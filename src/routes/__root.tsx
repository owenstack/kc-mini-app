import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/main/header.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import type { QueryClient } from "@tanstack/react-query";
import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
			<Header />
			<Outlet />
			<Toaster richColors position="top-center" />
			<TanStackRouterDevtools />

			<TanStackQueryLayout />
		</>
	),
});
