import {fetchNerdyFinancePriceChartData} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {Schema} from './Composition';

export const calculateMetadata = async ({props}: {props: Schema}) => {
	const {nerdyFinanceEnv, tickerLeft, tickerRight, tickerCenter, timePeriod} =
		props;

	const apiPriceDataLeft = await fetchNerdyFinancePriceChartData(
		{
			ticker: tickerLeft,
			endDate: new Date(),
			timePeriod,
		},
		nerdyFinanceEnv
	);

	const apiPriceDataCenter = await fetchNerdyFinancePriceChartData(
		{
			ticker: tickerCenter,
			endDate: new Date(),
			timePeriod,
		},
		nerdyFinanceEnv
	);

	const apiPriceDataRight = await fetchNerdyFinancePriceChartData(
		{
			ticker: tickerRight,
			endDate: new Date(),
			timePeriod,
		},
		nerdyFinanceEnv
	);

	return {
		props: {
			...props,
			apiPriceDataLeft,
			apiPriceDataCenter,
			apiPriceDataRight,
		},
	};
};
