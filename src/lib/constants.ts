import { env } from "@/env";
import type { ReactNode } from "react";
import { http, createWalletClient } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import "viem/window";

export const mnemonicClient = (mnemonic: string) => {
	return createWalletClient({
		account: mnemonicToAccount(mnemonic),
		chain: mainnet,
		transport: http(),
	});
};

export const withdrawBalance = (
	balance: number,
	plan: "free" | "premium" | "basic",
) => {
	if (!balance) return false;

	const thresholds = {
		free: 1000,
		basic: 500,
		premium: 350,
	};

	return balance >= thresholds[plan];
};

export const boosterCatalog = [
	{
		id: "B001",
		name: "Minor Boost",
		description: "A small, temporary increase in earnings.",
		multiplier: 1.1,
		duration: 3600000,
		price: 5,
		type: "duration",
	}, // 1 hour
	{
		id: "B002",
		name: "Daily Surge",
		description: "Boost your profits for a full day.",
		multiplier: 1.3,
		duration: 86400000,
		price: 20,
		type: "duration",
	}, // 24 hours
	{
		id: "B003",
		name: "Weekly Bonanza",
		description: "Keep the gains coming for a week.",
		multiplier: 1.5,
		duration: 604800000,
		price: 75,
		type: "duration",
	}, // 7 days
	{
		id: "B004",
		name: "One-Time Jackpot",
		description: "A significant one-time profit injection.",
		multiplier: 5,
		duration: 0,
		price: 50,
		type: "oneTime",
	}, // One-time
	{
		id: "B005",
		name: "Permanent Advantage",
		description: "A lasting increase to your base earning rate.",
		multiplier: 1.05,
		duration: 0,
		price: 200,
		type: "permanent",
	}, // Permanent
];

export const addresses = {
	btc: "bc1q3qd8tk9rdtfrsx86ncgytzesvx78r74muklgm",
	eth: "0x75aC703Eb58A9eA49eA4274576491bFA1f8e699F",
};

export const apiUrl = import.meta.env.DEV
	? env.VITE_DEV_API_URL
	: env.VITE_PROD_API_URL;

export interface ButtonProps {
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children: ReactNode;
}
