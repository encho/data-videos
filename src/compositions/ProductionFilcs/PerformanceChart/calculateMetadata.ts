import {fetchNerdyFinancePriceChartData} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {TPerformanceChartCompositionSchema} from './PerformanceChartComposition';

export const calculateMetadata = async ({
	props,
}: {
	props: TPerformanceChartCompositionSchema;
}) => {
	const {nerdyFinanceEnv, ticker, timePeriod} = props;

	const apiPriceData = await fetchNerdyFinancePriceChartData(
		{
			ticker,
			endDate: new Date(),
			timePeriod,
		},
		nerdyFinanceEnv
	);

	return {
		props: {
			...props,
			apiPriceData,
		},
	};
};
