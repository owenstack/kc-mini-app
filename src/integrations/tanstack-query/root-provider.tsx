import { env } from "@/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { isMiniAppDark, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import WebApp from "@twa-dev/sdk";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useMemo } from "react";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

const queryClient = new QueryClient();

export function getContext() {
	return {
		queryClient,
	};
}

const config = createConfig(
	getDefaultConfig({
		chains: [mainnet],
		transports: {
			// RPC URL for each chain
			[mainnet.id]: http(),
		},
		// Required API Keys
		walletConnectProjectId: env.VITE_FAMILY_PROJECT_ID,
		// Required App Info
		appName: "Galaxy MEV",
	}),
);

WebApp.ready();

export function Provider({ children }: { children: React.ReactNode }) {
	const lp = useMemo(() => retrieveLaunchParams(), []);
	const isDark = useSignal(isMiniAppDark);
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider>
					<AppRoot
						appearance={isDark ? "dark" : "light"}
						platform={
							["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"
						}
					>
						{children}
					</AppRoot>
				</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
