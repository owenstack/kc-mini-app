import { useStore } from "./store";

// Constants for multipliers and thresholds
const MULTIPLIERS = {
	PREMIUM: 0.25,
	BASIC: 0.15,
	FREE: 0.001,
	MAX_TIME_BASED: 0.3,
	TIME_GROWTH_RATE: 0.02,
};

const MEV_CONFIG = {
	BASE_MIN: 1,
	BASE_MAX: 50,
	SPIKE_CHANCE: 0.1,
	SPIKE_MIN: 10,
	SPIKE_MAX: 50,
};

const SCALPER_CONFIG = {
	BASE_MIN: -0.02,
	BASE_MAX: 0.08,
	TREND_STRENGTH: 0.03,
	TREND_CHANGE_CHANCE: 0.1,
	MIN_VALUE: -0.1,
	MAX_VALUE: 0.2,
};

export interface DataPoint {
	timestamp: number;
	value: number;
}

function getUserPlanMultiplier(): number {
	const { user } = useStore.getState();
	if (!user || !user.createdAt) return MULTIPLIERS.FREE;

	switch (user.planType) {
		case "premium":
			return MULTIPLIERS.PREMIUM;
		case "basic":
			return MULTIPLIERS.BASIC;
		default:
			return MULTIPLIERS.FREE;
	}
}

function getTimeBasedMultiplier(): number {
	const { user } = useStore.getState();
	if (!user || !user.createdAt) {
		return 1;
	}

	const createdAtMs = new Date(user.createdAt).getTime();
	const accountAgeInWeeks =
		(Date.now() - createdAtMs) / (7 * 24 * 60 * 60 * 1000);

	const timeMultiplier = Math.max(
		0,
		Math.min(
			accountAgeInWeeks * MULTIPLIERS.TIME_GROWTH_RATE,
			MULTIPLIERS.MAX_TIME_BASED,
		),
	);

	return 1 + timeMultiplier;
}

function getBoosterMultiplier(): number {
	const { activeBoosters } = useStore.getState();
	const now = Date.now();
	return activeBoosters
		.filter((booster) => !booster.expiresAt || booster.expiresAt > now)
		.reduce((total, booster) => total * booster.multiplier, 1);
}

async function calculateAdjustedValue(baseValue: number): Promise<number> {
	if (typeof baseValue !== "number" || Number.isNaN(baseValue)) {
		console.error("Invalid baseValue:", baseValue);
		return 0;
	}

	const planMultiplier = getUserPlanMultiplier();
	const timeMultiplier = getTimeBasedMultiplier();
	const boosterMultiplier = getBoosterMultiplier();

	return baseValue * planMultiplier * timeMultiplier * boosterMultiplier;
}

export async function generateDataPoint(min = 0, max = 1): Promise<DataPoint> {
	const baseValue = min + Math.random() * (max - min);
	const value = await calculateAdjustedValue(baseValue);
	const { user, updateUser } = useStore.getState();
	if (user) {
		console.log("Adding value to balance:", value);
		updateUser({ ...user, balance: user.balance + value });
	}
	return {
		timestamp: Date.now(),
		value,
	};
}

export async function generateHistoricalData(
	count: number,
	min = 0,
	max = 1,
	startTime = Date.now() - count * 1000,
): Promise<DataPoint[]> {
	const points: DataPoint[] = [];
	const { user, updateUser } = useStore.getState();
	for (let i = 0; i < count; i++) {
		const baseValue = min + Math.random() * (max - min);
		const value = await calculateAdjustedValue(baseValue);
		if (user) {
			updateUser({ ...user, balance: user.balance + value });
		}
		points.push({
			timestamp: startTime + i * 1000,
			value,
		});
	}
	return points;
}

export async function generateMEVData(
	count: number,
	baseMin = MEV_CONFIG.BASE_MIN,
	baseMax = MEV_CONFIG.BASE_MAX,
	spikeChance = MEV_CONFIG.SPIKE_CHANCE,
	spikeMin = MEV_CONFIG.SPIKE_MIN,
	spikeMax = MEV_CONFIG.SPIKE_MAX,
	startTime = Date.now() - count * 1000,
): Promise<DataPoint[]> {
	const points: DataPoint[] = [];
	const { user, updateUser } = useStore.getState();
	for (let i = 0; i < count; i++) {
		const isSpike = Math.random() < spikeChance;
		const min = isSpike ? spikeMin : baseMin;
		const max = isSpike ? spikeMax : baseMax;
		const baseValue = min + Math.random() * (max - min);
		const value = await calculateAdjustedValue(baseValue);
		if (user) {
			updateUser({ ...user, balance: user.balance + value });
		}
		points.push({
			timestamp: startTime + i * 1000,
			value,
		});
	}
	return points;
}

export async function generateScalperData(
	count: number,
	baseMin = SCALPER_CONFIG.BASE_MIN,
	baseMax = SCALPER_CONFIG.BASE_MAX,
	trendStrength = SCALPER_CONFIG.TREND_STRENGTH,
	startTime = Date.now() - count * 1000,
): Promise<DataPoint[]> {
	const points: DataPoint[] = [];
	const { user, updateUser } = useStore.getState();
	let trend = 0;
	for (let i = 0; i < count; i++) {
		if (Math.random() < SCALPER_CONFIG.TREND_CHANGE_CHANCE) {
			trend = -1 + Math.random() * 2;
		}
		let value =
			baseMin + Math.random() * (baseMax - baseMin) + trend * trendStrength;
		value = Math.max(
			SCALPER_CONFIG.MIN_VALUE,
			Math.min(value, SCALPER_CONFIG.MAX_VALUE),
		);
		const adjustedValue = await calculateAdjustedValue(value);
		if (user) {
			updateUser({ ...user, balance: user.balance + adjustedValue });
		}
		points.push({
			timestamp: startTime + i * 1000,
			value: adjustedValue,
		});
	}
	return points;
}

export async function getSimulatedData(
	type: "random" | "mev" | "scalper" = "random",
	count = 10,
): Promise<DataPoint[]> {
	switch (type) {
		case "mev":
			return generateMEVData(count);
		case "scalper":
			return generateScalperData(count);
		default:
			return generateHistoricalData(count);
	}
}
