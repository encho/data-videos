import {fetchNerdyFinancePerformanceCompareData} from '../../../acetti-http/nerdy-finance/fetchPerformanceCompareData';
import {TPerformanceCompareChartCompositionSchema} from './PerformanceCompareChartComposition';

export const calculateMetadata = async ({
	props,
}: {
	props: TPerformanceCompareChartCompositionSchema;
}) => {
	const {nerdyFinanceEnv, ticker, ticker2, timePeriod} = props;

	const apiPerformanceCompareData =
		await fetchNerdyFinancePerformanceCompareData(
			{
				ticker,
				ticker2,
				endDate: new Date().toISOString(),
				timePeriod,
			},
			nerdyFinanceEnv
		);

	return {
		props: {
			...props,
			apiPerformanceCompareData,
		},
	};
};
