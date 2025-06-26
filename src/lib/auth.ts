import { retrieveLaunchParams } from "@telegram-apps/sdk";
import {
	apiUrl,
	zodActiveBoosters,
	zodBoosters,
	zodDataPoints,
	zodPlan,
	type zodTransaction,
	zodTransactions,
	zodUser,
} from "./constants";
import type { z } from "zod";

class TelegramAuth {
	private initData: unknown | null = null;
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
		this.initializeAuth();
	}

	private initializeAuth() {
		try {
			const { initDataRaw } = retrieveLaunchParams();
			this.initData = initDataRaw;
		} catch (error) {
			console.error("Failed to retrieve Telegram launch params:", error);
			// For development/testing, you might want to handle this differently
		}
	}

	private getAuthHeaders(): HeadersInit {
		if (!this.initData) {
			throw new Error("No Telegram authentication data available");
		}

		return {
			Authorization: `tma ${this.initData}`,
			"Content-Type": "application/json",
		};
	}

	// Generic API call method
	async apiCall<T = any>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			...options,
			headers: {
				...this.getAuthHeaders(),
				...options.headers,
			},
		};

		const response = await fetch(url, config);

		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ error: "Unknown error" }));
			throw new Error(errorData.error || `HTTP ${response.status}`);
		}

		return response.json();
	}

	// Convenience methods for common HTTP operations
	async get<T = any>(endpoint: string): Promise<T> {
		return this.apiCall<T>(endpoint, { method: "GET" });
	}

	async post<T = any>(endpoint: string, data?: any): Promise<T> {
		return this.apiCall<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
		return this.apiCall<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T = unknown>(endpoint: string): Promise<T> {
		return this.apiCall<T>(endpoint, { method: "DELETE" });
	}

	// Check if user is authenticated
	isAuthenticated(): boolean {
		return this.initData !== null;
	}

	// Get current user info
	async getCurrentUser() {
		const response = await this.get("/api/auth/me");
		const { data, error } = await zodUser.safeParseAsync(response.user);
		if (error) {
			throw new Error(`Failed to parse user data: ${error.issues[0].message}`);
		}
		return data;
	}

	// Get user plan
	async getUserPlan() {
		const response = await this.get("/api/get-plan");
		const { data, error } = await zodPlan.safeParseAsync(response.plan);
		if (error) {
			throw new Error(`Failed to parse plan data: ${error.issues[0].message}`);
		}
		return data;
	}

	// Get user transactions
	async getUserTransactions() {
		const response = await this.get("/api/transactions/get");
		const { data, error } = await zodTransactions.safeParseAsync(
			response.transactions,
		);
		if (error) {
			throw new Error(
				`Failed to parse transaction data: ${error.issues[0].message}`,
			);
		}
		return data;
	}

	// Create transaction
	async createTransaction(
		transactionData: z.infer<typeof zodTransaction>,
	): Promise<{ success: boolean }> {
		return this.post("/api/transactions/create", transactionData);
	}

	// Get available boosters
	async getAvailableBoosters() {
		const response = await this.get("/api/boosters");
		const { data, error } = await zodBoosters.safeParseAsync(response.boosters);
		if (error) {
			throw new Error(
				`Failed to parse boosters data: ${error.issues[0].message}`,
			);
		}
		return data;
	}

	// Get active boosters
	async getActiveBoosters() {
		const response = await this.get("/api/boosters/active");
		const { data, error } = await zodActiveBoosters.safeParseAsync(
			response.activeBoosters,
		);
		if (error) {
			throw new Error(
				`Failed to parse active boosters data: ${error.issues[0].message}`,
			);
		}
		return data;
	}

	// Purchase booster
	async purchaseBooster(
		boosterId: string,
		useExternalPayment = false,
	): Promise<{ success: boolean }> {
		return this.post("/api/boosters/purchase", {
			boosterId,
			useExternalPayment,
		});
	}

	// Get bot data
	async getBotData(type: "random" | "mev" | "scalper" = "random", count = 100) {
		const response = await this.get(
			`/api/bot-data?type=${type}&count=${count}`,
		);
		const { data, error } = await zodDataPoints.safeParseAsync(response.data);
		if (error) {
			throw new Error(`Failed to parse bot data: ${error.issues[0].message}`);
		}
		return data;
	}
}

// Create and export a singleton instance
export const telegramAuth = new TelegramAuth(apiUrl);

// Export the class for custom instances if needed
export { TelegramAuth };
