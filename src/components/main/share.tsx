import { env } from "@/env";
import type { ButtonProps } from "@/lib/constants";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { initDataState, useSignal } from "@telegram-apps/sdk-react";
import { Button } from "../ui/button";

export function Share({ children, variant, size, className }: ButtonProps) {
	const tgData = useSignal(initDataState);
	return (
		<Button
			variant={variant}
			size={size}
			onClick={() => {
				openTelegramLink(
					`https://t.me/share/url?url=https://t.me/${env.VITE_APP_TITLE}?start=ref=${tgData?.user?.id}`,
				);
			}}
			className={className}
		>
			{children}
		</Button>
	);
}
