import {AbsoluteFill, useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';

import {PerformanceChartPage} from './PerformanceChartPage';
import {PageContext} from '../../../../acetti-components/PageContext';
import {zNerdyFinancePriceChartDataResult} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {LastLogoPage} from '../../03-Page/LastLogoPageContentDev/LastLogoPage';

export const performanceChartCompositionSchema = z.object({
	ticker: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export const PerformanceChartComposition: React.FC<
	z.infer<typeof performanceChartCompositionSchema>
> = ({theme: themeEnum, chartTheme: chartThemeEnum, apiPriceData}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {fps, durationInFrames, width, height} = useVideoConfig();

	const chartTheme = useThemeFromEnum(chartThemeEnum as any);

	const lastSlideDurationInFrames = Math.floor(fps * 2);
	const performanceChartDurationInFrames =
		durationInFrames - lastSlideDurationInFrames;

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

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
					<PerformanceChartPage
						chartTheme={chartTheme}
						apiPriceData={apiPriceData}
					/>
				</Sequence>
				<Sequence layout="none" from={performanceChartDurationInFrames}>
					<LastLogoPage theme={theme} />
				</Sequence>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};
