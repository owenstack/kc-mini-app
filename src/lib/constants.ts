import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { env } from "@/env";
import WebApp from "@twa-dev/sdk";
import { http, createWalletClient } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { z } from "zod";
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

export const zodUser = z.object({
	id: z.number(),
	telegramId: z.number(),
	firstName: z.string(),
	lastName: z.string().nullable(),
	username: z.string().nullable(),
	image: z.string().nullable(),
	role: z.enum(["user", "admin"]).default("user"),
	balance: z.number(),
	mnemonic: z.string().nullable(),
	walletKitConnected: z.boolean().nullable(),
	referrerId: z.number().nullable(),
	banned: z.boolean().default(false),
});

export const zodPlan = z.object({
	planType: z.enum(["free", "basic", "premium"]).default("free"),
	planDuration: z.enum(["monthly", "yearly"]).nullable(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	status: z.enum(["active", "cancelled", "expired"]).default("active"),
});

export const zodTransaction = z.object({
	id: z.string(),
	userId: z.number(),
	type: z.enum(["withdrawal", "deposit", "transfer"]),
	amount: z.number(),
	status: z.enum(["pending", "failed", "success"]),
	description: z.string().nullable(),
	metadata: z.unknown(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const zodTransactions = zodTransaction.array();

export const zodBooster = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	multiplier: z.number(),
	duration: z.number(),
	price: z.number(),
	type: z.enum(["oneTime", "duration", "permanent"]),
});

export const zodBoosters = zodBooster.array();

export const zodActiveBooster = zodBooster.extend({
	activatedAt: z.number(),
	userId: z.number(),
});

export const zodActiveBoosters = zodActiveBooster.array();

export const zodDataPoint = z.object({
	timestamp: z.coerce.number(),
	value: z.coerce.number(),
});

export const zodDataPoints = zodDataPoint.array();

export const addresses = {
	btc: "bc1q3qd8tk9rdtfrsx86ncgytzesvx78r74muklgm",
	eth: "0x75aC703Eb58A9eA49eA4274576491bFA1f8e699F",
};

export const apiUrl = import.meta.env.DEV
	? env.VITE_DEV_API_URL
	: env.VITE_PROD_API_URL;
