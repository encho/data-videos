import {z} from 'zod';

import {zTimeSeries} from '../../acetti-ts-utils/timeSeries/timeSeries';

export const zNerdyFinancePortfolioTotalValueResult = zTimeSeries;

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

	const totalValueSeriesResult = await data.json();

	const totalValueTimeseries: TNerdyFinancePortfolioTotalValueResult =
		totalValueSeriesResult.map((it: {date: string; total_value: number}) => ({
			value: it.total_value,
			date: new Date(it.date),
		}));

	try {
		// Validate the data
		zTimeSeries.parse(totalValueTimeseries);
	} catch (error) {
		// Handle validation errors
		if (error instanceof z.ZodError) {
			console.error('Validation failed:', error.errors);
		} else {
			console.error('Unexpected error:', error);
		}
	}

	return totalValueTimeseries;
};
