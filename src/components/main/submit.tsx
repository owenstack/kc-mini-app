import type { ButtonProps } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function Submit({ children, variant, size }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" variant={variant} size={size} disabled={pending}>
			{pending ? <Loader2 className="animate-spin w-4 h-4" /> : children}
		</Button>
	);
}
