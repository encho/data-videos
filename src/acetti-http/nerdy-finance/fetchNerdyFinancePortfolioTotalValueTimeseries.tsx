import {z} from 'zod';

// TODO use zTimeseries, which we need to create in ts-utils...
export const zNerdyFinancePortfolioTotalValueResult = z.array(
	z.object({
		value: z.number().nullable(),
		date: z.date(),
	})
);

export type TNerdyFinancePortfolioTotalValueResult = z.infer<
	typeof zNerdyFinancePortfolioTotalValueResult
>;

type TNerdyFinancePortoflioTotalValueArgs = {
	strategyTicker: string;
};

export const fetchNerdyFinancePortfolioTotalValueTimeseries = async (
	{strategyTicker}: TNerdyFinancePortoflioTotalValueArgs,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinancePortfolioTotalValueResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	const apiUrl = `${apiBase}/strategies/series/backtests/total_value/${strategyTicker}`;

	const data = await fetch(apiUrl);

	// TODO validate a specific return type
	// maybe with zod it is possible?
	const totalValueSeriesResult = await data.json();

	const totalValueTimeseries: TNerdyFinancePortfolioTotalValueResult =
		totalValueSeriesResult.map((it: {date: string; total_value: number}) => ({
			value: it.total_value,
			date: new Date(it.date),
		}));

	return totalValueTimeseries;
};
