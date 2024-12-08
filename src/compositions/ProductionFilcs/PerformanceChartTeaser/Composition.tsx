import {AbsoluteFill, useVideoConfig, Sequence} from 'remotion';
import {z} from 'zod';

import {PerformanceChartPage} from './PerformanceChartPage';
import {PageContext} from '../../../acetti-components/PageContext';
import {zNerdyFinancePriceChartDataResult} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../acetti-components/GlobalVideoContext';
import {LastLogoPage} from '../../POCs/03-Page/LastLogoPageContentDev/LastLogoPage';
import {BringForwardCenterTile} from '../../POCs/3D-Experiments/BrintForwardCenterTile/BringForwardCenterTile';
import {PageLogo} from '../../../acetti-components/Page';

export const schema = z.object({
	ticker: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export const Composition: React.FC<z.infer<typeof schema>> = ({
	theme: themeEnum,
	chartTheme: chartThemeEnum,
	apiPriceData,
}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {fps, durationInFrames, width, height} = useVideoConfig();

	// const chartTheme = useThemeFromEnum(chartThemeEnum as any);
	const chartTheme = useThemeFromEnum(chartThemeEnum);

	const lastSlideDurationInFrames = Math.floor(fps * 2);
	const performanceChartDurationInFrames =
		durationInFrames - lastSlideDurationInFrames;

	if (!apiPriceData) {
		return <AbsoluteFill />;
	}

	return (
		<GlobalVideoContextWrapper>
			<Sequence
				layout="none"
				from={fps * 0}
				durationInFrames={performanceChartDurationInFrames}
			>
				<PageContext
					width={width}
					height={height}
					margin={60}
					nrBaselines={60}
					theme={chartTheme}
				>
					<div style={{width, height, backgroundColor: '#f05122'}}>
						<BringForwardCenterTile
							centerTile={() => {
								return <PerformanceChartPage apiPriceData={apiPriceData} />;
							}}
							rightTile={() => {
								return <PerformanceChartPage apiPriceData={apiPriceData} />;
							}}
							leftTile={() => {
								return <PerformanceChartPage apiPriceData={apiPriceData} />;
							}}
						/>
					</div>
					<PageLogo />
				</PageContext>
			</Sequence>
			<Sequence layout="none" from={performanceChartDurationInFrames}>
				<PageContext
					width={width}
					height={height}
					margin={60}
					nrBaselines={60}
					theme={theme}
				>
					<LastLogoPage theme={theme} />
				</PageContext>
			</Sequence>
		</GlobalVideoContextWrapper>
	);
};
