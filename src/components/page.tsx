import { useRouter } from "@tanstack/react-router";
import {
	hideBackButton,
	onBackButtonClick,
	showBackButton,
} from "@telegram-apps/sdk-react";
import { type PropsWithChildren, useEffect } from "react";

export function Page({
	children,
	back = true,
}: PropsWithChildren<{
	/**
	 * True if it is allowed to go back from this page.
	 */
	back?: boolean;
}>) {
	const router = useRouter();

	useEffect(() => {
		if (back) {
			showBackButton();
			return onBackButtonClick(() => {
				router.history.back();
			});
		}
		hideBackButton();
	}, [back, router]);

	return <>{children}</>;
}
