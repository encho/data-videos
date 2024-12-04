import {AbsoluteFill, useVideoConfig} from 'remotion';
import {z} from 'zod';
import invariant from 'tiny-invariant';
import {useMemo} from 'react';

import {BacktestChartPage} from './BacktestChartPage';
import {PageContext} from '../../../acetti-components/PageContext';
import {zNerdyFinancePriceChartDataResult} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../acetti-components/GlobalVideoContext';
import {LastLogoPage} from '../../POCs/03-Page/LastLogoPageContentDev/LastLogoPage';
import {zNerdyFinance_availableStrategies} from '../../../acetti-http/nerdy-finance/types/nerdyFinance_types_availableStrategies';
import {zNerdyFinance_strategyInfo} from '../../../acetti-http/nerdy-finance/types/nerdyFinance_types_strategyInfo';
import {
	TKeyFrameSpec,
	buildKeyFramesGroup,
} from '../../POCs/Keyframes/Keyframes/keyframes';
import {KeyFramesSequence} from '../../POCs/Keyframes/Keyframes/KeyframesInspector';
import {Page, PageLogo} from '../../../acetti-components/Page';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';

export const zBacktestChartCompositionSchema = z.object({
	strategyTicker: zNerdyFinance_availableStrategies,
	strategyInfo: zNerdyFinance_strategyInfo.optional(),
	ticker: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceData: zNerdyFinancePriceChartDataResult.optional(),
});

export type TBacktestChartCompositionSchema = z.infer<
	typeof zBacktestChartCompositionSchema
>;

export const BacktestChartComposition: React.FC<
	z.infer<typeof zBacktestChartCompositionSchema>
> = ({
	theme: themeEnum,
	chartTheme: chartThemeEnum,
	apiPriceData,
	strategyInfo,
}) => {
	invariant(
		strategyInfo,
		'BacktestChartComposition: strategyInfo has to be provided by calculateMetaData'
	);
	const {width, height} = useVideoConfig();
	const keyframes = useCompositionKeyframes();
	const theme = useThemeFromEnum(themeEnum);
	const chartTheme = useThemeFromEnum(chartThemeEnum);

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
				<>
					<KeyFramesSequence
						name="LOGO"
						from="TITLE_SEQUENCE_START"
						to="CHART_SEQUENCE_END"
						keyframes={keyframes}
					>
						<PageLogo />
					</KeyFramesSequence>

					<KeyFramesSequence
						name="TITLE"
						from="TITLE_SEQUENCE_START"
						to="TITLE_SEQUENCE_END"
						keyframes={keyframes}
					>
						<Page>
							{({baseline}) => (
								<TitleWithSubtitle
									title={strategyInfo.name}
									// subtitle={strategyInfo.description.slice(0, 4)}
									subtitle={strategyInfo.description}
									theme={theme}
									baseline={baseline * 1.5}
								/>
							)}
						</Page>
					</KeyFramesSequence>
					<KeyFramesSequence
						name="CHART"
						from="CHART_SEQUENCE_START"
						to="CHART_SEQUENCE_END"
						keyframes={keyframes}
					>
						<BacktestChartPage
							chartTheme={chartTheme}
							apiPriceData={apiPriceData}
						/>
					</KeyFramesSequence>
				</>
			</PageContext>

			<KeyFramesSequence
				name="LAST_SLIDE"
				from="LAST_SLIDE_SEQUENCE_START"
				to="LAST_SLIDE_SEQUENCE_END"
				keyframes={keyframes}
			>
				<PageContext
					width={width}
					height={height}
					margin={0}
					nrBaselines={40}
					theme={theme}
				>
					<LastLogoPage />
				</PageContext>
			</KeyFramesSequence>
		</GlobalVideoContextWrapper>
	);
};

function useCompositionKeyframes() {
	const {durationInFrames, fps} = useVideoConfig();

	const titleSequenceDurationInSeconds = 6;
	const lastSlideDurationInSeconds = 3;

	const remainingDurationInFrames =
		durationInFrames -
		titleSequenceDurationInSeconds * fps -
		lastSlideDurationInSeconds * fps;

	const keyframes = useMemo(() => {
		const keyframeSpecs: TKeyFrameSpec[] = [
			{
				type: 'SECOND',
				value: 0,
				id: 'TITLE_SEQUENCE_START',
			},
			{
				type: 'R_SECOND',
				value: titleSequenceDurationInSeconds,
				id: 'TITLE_SEQUENCE_END',
				relativeId: 'TITLE_SEQUENCE_START',
			},
			{
				type: 'R_SECOND',
				value: 0,
				id: 'CHART_SEQUENCE_START',
				relativeId: 'TITLE_SEQUENCE_END',
			},
			{
				type: 'R_FRAME',
				value: remainingDurationInFrames,
				id: 'CHART_SEQUENCE_END',
				relativeId: 'CHART_SEQUENCE_START',
			},
			{
				type: 'R_SECOND',
				value: 0,
				id: 'LAST_SLIDE_SEQUENCE_START',
				relativeId: 'CHART_SEQUENCE_END',
			},
			{
				type: 'R_SECOND',
				value: lastSlideDurationInSeconds,
				id: 'LAST_SLIDE_SEQUENCE_END',
				relativeId: 'LAST_SLIDE_SEQUENCE_START',
			},
		];

		return buildKeyFramesGroup(durationInFrames, fps, keyframeSpecs);
	}, [
		durationInFrames,
		fps,
		lastSlideDurationInSeconds,
		remainingDurationInFrames,
	]);

	return keyframes;
}
