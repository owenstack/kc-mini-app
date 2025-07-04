import { env } from "@/env";
import { useStore } from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import {
	initDataUser,
	isMiniAppDark,
	useSignal,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect, useMemo } from "react";
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
			[mainnet.id]: http(
				`https://eth-mainnet.g.alchemy.com/v2/${env.VITE_ALCHEMY_API_KEY}`,
			),
		},
		// Required API Keys
		walletConnectProjectId: env.VITE_FAMILY_PROJECT_ID,
		// Required App Info
		appName: "Galaxy MEV",
	}),
);

export function Provider({ children }: { children: React.ReactNode }) {
	const lp = useMemo(() => retrieveLaunchParams(), []);
	useEffect(() => {
		if (!localUser) {
			setUser({
				id: user?.id.toString() ?? "",
				telegramId: user?.id.toString() ?? "",
				username: user?.username,
				balance: 0,
				role: "user",
				planType: "free",
				walletKitConnected: false,
				banned: false,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}
	}, []);
	const user = useSignal(initDataUser);
	const { setUser, user: localUser } = useStore();

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
