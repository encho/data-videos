import {z} from 'zod';
import {TNerdyFinance_availableStrategies} from './types/nerdyFinance_types_availableStrategies';

export const zNerdyFinanceStrategyResult = z.object({
	ticker: z.string(),
	name: z.string(),
	description: z.string(),
	rebalancing: z.string(),
});

export type TNerdyFinanceStrategyResult = z.infer<
	typeof zNerdyFinanceStrategyResult
>;

export const fetchStrategyInfo = async (
	strategyTicker: TNerdyFinance_availableStrategies,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinanceStrategyResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	const apiUrl = `${apiBase}/strategies/${strategyTicker}`;

	const data = await fetch(apiUrl);
	const parsedData = await data.json();

	return parsedData;
};
