import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { env } from "@/env";
import WebApp from "@twa-dev/sdk";
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

export const tgData = WebApp.initDataUnsafe;
export const { openTelegramLink, showPopup } = WebApp;
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

export const fetcher = async (url: string, method: "GET" | "POST" = "GET") => {
	const { initDataRaw } = retrieveLaunchParams();
	const response = await fetch(url, {
		method,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `tma ${initDataRaw}`,
		},
	});
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Network response was not ok: ${error}`);
	}
	const data = await response.json();
	return data;
};

export interface Booster {
	id: string;
	name: string;
	description: string;
	multiplier: number;
	duration: number; // Duration in milliseconds, 0 for one-time use
	price: number;
	type: "oneTime" | "duration" | "permanent";
}

export interface ActiveBooster extends Booster {
	activatedAt: number;
	userId: string;
}

export interface DataPoint {
	timestamp: number; // Unix timestamp in milliseconds
	value: number; // The profit/loss value
}

export interface Plan {
	planType: "free" | "basic" | "premium";
	planDuration: "monthly" | "yearly" | null;
	startDate: Date;
	endDate: Date;
	status: "active" | "cancelled" | "expired";
}

export const addresses = {
	btc: "bc1q3qd8tk9rdtfrsx86ncgytzesvx78r74muklgm",
	eth: "0x75aC703Eb58A9eA49eA4274576491bFA1f8e699F",
};

export const apiUrl = import.meta.env.DEV
	? env.VITE_DEV_API_URL
	: env.VITE_PROD_API_URL;
