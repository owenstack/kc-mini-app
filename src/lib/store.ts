import { create } from "zustand";
import { persist } from "zustand/middleware";

// Based on the backend schema
export interface User {
	id: string; // telegramId will be the primary ID
	telegramId: string;
	firstName?: string;
	lastName?: string;
	username?: string;
	image?: string;
	role: "user" | "admin";
	balance: number;
	planType: "free" | "basic" | "premium";
	mnemonic?: string;
	walletKitConnected: boolean;
	referrerId?: number;
	banned: boolean;
	banReason?: string;
	banExpires?: number; // timestamp
	createdAt: number; // timestamp
	updatedAt: number; // timestamp
}

export interface ActiveBooster {
	id: string; // Unique instance ID
	boosterId: string; // ID from the catalog of available boosters
	name: string; // Copied from catalog for convenience
	activatedAt: number; // timestamp
	expiresAt?: number; // timestamp, null for permanent boosters
	type: "oneTime" | "duration" | "permanent";
	multiplier: number;
}

interface StoreState {
	user: User | null;
	activeBoosters: ActiveBooster[];
	setUser: (user: User) => void;
	updateUser: (user: Partial<User>) => void;
	addBooster: (booster: ActiveBooster) => void;
	clearAllData: () => void;
}

export const useStore = create<StoreState>()(
	persist(
		(set) => ({
			user: null,
			activeBoosters: [],
			setUser: (user) => set({ user: { ...user, updatedAt: Date.now() } }),
			updateUser: (userUpdate) =>
				set((state) => {
					const newUser = state.user
						? { ...state.user, ...userUpdate, updatedAt: Date.now() }
						: null;
					return { user: newUser };
				}),
			addBooster: (booster) =>
				set((state) => ({
					activeBoosters: [...state.activeBoosters, booster],
				})),
			clearAllData: () =>
				set(() => ({
					user: null,
					activeBoosters: [],
				})),
		}),
		{ name: "kc-mini-app-storage" },
	),
);
