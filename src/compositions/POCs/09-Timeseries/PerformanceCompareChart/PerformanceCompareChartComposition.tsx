import {useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';
import {useMemo} from 'react';
import invariant from 'tiny-invariant';

import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/timeSeries';
import {PerformanceCompareChartPage} from './PerformanceCompareChartPage';
import {PageContext} from '../../../../acetti-components/PageContext';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {LastLogoPage} from '../../03-Page/LastLogoPageContentDev/LastLogoPage';
import {zNerdyFinancePerformanceCompareChartDataResult} from '../../../../acetti-http/nerdy-finance/fetchPerformanceCompareData';

export const performanceCompareChartCompositionSchema = z.object({
	ticker: zNerdyTickers,
	ticker2: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPerformanceCompareData:
		zNerdyFinancePerformanceCompareChartDataResult.optional(),
});

export const PerformanceCompareChartComposition: React.FC<
	z.infer<typeof performanceCompareChartCompositionSchema>
> = ({
	theme: themeEnum,
	chartTheme: chartThemeEnum,
	apiPerformanceCompareData,
}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {fps, durationInFrames, width, height} = useVideoConfig();

	// const chartTheme = useThemeFromEnum(chartThemeEnum as any);
	const chartTheme = useThemeFromEnum(chartThemeEnum);

	const lastSlideDurationInFrames = Math.floor(fps * 2);
	const performanceChartDurationInFrames =
		durationInFrames - lastSlideDurationInFrames;

	invariant(apiPerformanceCompareData);

	const {timeSeries1, timeSeries2} = useMemo(() => {
		const multiSeries = apiPerformanceCompareData.data;

		const dates = multiSeries.index;
		const series1 = multiSeries.series[0];
		const series2 = multiSeries.series[1];

		const timeSeries1: TimeSeries = [];
		const timeSeries2: TimeSeries = [];

		dates.forEach((date, i) => {
			timeSeries1.push({value: series1[i], date});
			timeSeries2.push({value: series2[i], date});
		});

		return {timeSeries1, timeSeries2};
	}, [apiPerformanceCompareData]);

	return (
		<GlobalVideoContextWrapper>
			<PageContext
				width={width}
				height={height}
				margin={60}
				nrBaselines={60}
				theme={theme}
			>
				<Sequence
					layout="none"
					from={fps * 0}
					durationInFrames={performanceChartDurationInFrames}
				>
					<PerformanceCompareChartPage
						chartTheme={chartTheme}
						// apiPriceData={apiPriceData}
						timeSeries1={timeSeries1}
						timeSeries2={timeSeries2}
					/>
				</Sequence>
				<Sequence layout="none" from={performanceChartDurationInFrames}>
					<LastLogoPage theme={theme} />
				</Sequence>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};
