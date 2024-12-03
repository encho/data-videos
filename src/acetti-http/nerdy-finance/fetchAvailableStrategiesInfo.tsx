import {z} from 'zod';

// [
// 	{
// 	_id: null,
// 	ticker: "BITCOIN_ONLY",
// 	name: "Bitcoin Long Only Strategy",
// 	description: "Bitcoin Long Only Strategy Description",
// 	rebalancing: "DAILY"
// 	},
// 	{

export const zNerdyFinanceAvailableStrategiesResult = z.array(
	z.object({
		ticker: z.string(),
		name: z.string(),
		description: z.string(),
		rebalancing: z.string(),
	})
);

export type TNerdyFinanceAvailableStrategiesResult = z.infer<
	typeof zNerdyFinanceAvailableStrategiesResult
>;

export const fetchAvailableStrategiesInfo = async (
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinanceAvailableStrategiesResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	// const apiUrl = `${apiBase}/flics/simple-price-chart?ticker=${ticker}&&endDate=${endDateString}&timePeriod=${timePeriod}`;
	const apiUrl = `${apiBase}/strategies`;

	const data = await fetch(apiUrl);
	const parsedData = await data.json();

	return parsedData;
};
