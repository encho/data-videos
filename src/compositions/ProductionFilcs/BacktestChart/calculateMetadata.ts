import {fetchNerdyFinancePortfolioTotalValueTimeseries} from '../../../acetti-http/nerdy-finance/fetchNerdyFinancePortfolioTotalValueTimeseries';
import {fetchNerdyFinancePriceChartData} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {fetchStrategyInfo} from '../../../acetti-http/nerdy-finance/fetchStrategyInfo';
import {TBacktestChartCompositionSchema} from './BacktestChartComposition';

export const calculateMetadata = async ({
	props,
}: {
	props: TBacktestChartCompositionSchema;
}) => {
	const {nerdyFinanceEnv, ticker, timePeriod, strategyTicker} = props;

	const strategyInfo = await fetchStrategyInfo(strategyTicker, nerdyFinanceEnv);

	console.log(
		'NOW GET INFO: http://127.0.0.1:5000/strategies/GOLD_CRYPTO_60_40: ',
		strategyTicker
	);

	console.log({strategyInfo});

	console.log(
		'NOW GET TOTAL PORTFOLIO VALUE:  http://127.0.0.1:5000/strategies/series/backtests/total_value/GOLD_CRYPTO_60_40: ',
		strategyTicker
	);
	console.log('NOW GET weights?: ', strategyTicker);

	const apiPriceData = await fetchNerdyFinancePriceChartData(
		{
			ticker,
			endDate: new Date(),
			timePeriod,
		},
		nerdyFinanceEnv
	);

	// TODO rename all to strategy instead of portfolio!?
	const portfolioTotalValueTimeseries =
		await fetchNerdyFinancePortfolioTotalValueTimeseries(
			{
				strategyTicker,
			},
			nerdyFinanceEnv
		);

	return {
		props: {
			...props,
			apiPriceData,
			strategyInfo,
			strategyTotalValueTimeseries: portfolioTotalValueTimeseries,
		},
	};
};
