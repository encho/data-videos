import {z} from 'zod';

export const zNerdyFinance_strategyInfo = z.object({
	description: z.string(),
	name: z.string(),
	rebalancing: z.string(), // "MONTHLY" | "DAILY"
	ticker: z.string(),
});

export type TNerdyFinance_strategyInfo = z.infer<
	typeof zNerdyFinance_strategyInfo
>;
