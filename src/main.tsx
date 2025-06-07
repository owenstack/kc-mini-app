import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import { init } from "@/components/init";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "@/components/mock-env";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { EnvUnsupported } from "./components/unsupported-env.tsx";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProvider.getContext(),
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	try {
		const launchParams = retrieveLaunchParams();
		const { tgWebAppPlatform: platform } = launchParams;
		const debug =
			(launchParams.tgWebAppStartParam || "").includes("platformer_debug") ||
			import.meta.env.DEV;
		await init({
			debug,
			eruda: debug && ["ios", "android"].includes(platform),
			mockForMacOS: platform === "macos",
		}).then(() => {
			root.render(
				<StrictMode>
					<TanStackQueryProvider.Provider>
						<RouterProvider router={router} />
					</TanStackQueryProvider.Provider>
				</StrictMode>,
			);
		});
	} catch (e) {
		root.render(<EnvUnsupported />);
	}
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
