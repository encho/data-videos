import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import LorenzoBertoliniLogo from '../acetti-components/LorenzoBertoliniLogo';
import {TitleSlide} from './TitleSlide';
import {Position} from '../AnimatedLineChartScaleBand/components/Position';
import {
	fetchNerdyFinancePriceChartData,
	TNerdyFinancePriceChartDataResult,
} from './fetchNerdyFinancePriceChartData';
import {LineChartSingle} from '../AnimatedLineChartScaleBand/flics/LineChartSingle/LineChartSingle';
import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {zNerdyTickers} from './zNerdyTickers';

export const nerdyPriceChartSingleSchema = z.object({
	ticker: zNerdyTickers,
	title: z.optional(z.string()),
	subtitle: z.optional(z.string()),
	showZero: z.boolean(),
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	styling: z
		.object({
			yAxisAreaWidth: z.number().optional(),
		})
		.optional(),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI']),
});

export const NerdyPriceChartSingle: React.FC<
	z.infer<typeof nerdyPriceChartSingleSchema>
> = ({ticker, timePeriod, nerdyFinanceEnv, themeEnum}) => {
	// TODO actually get height and with as props
	const {
		// height,
		width,
	} = useVideoConfig();

	const today = new Date();
	const endDate = today.toISOString();

	const [apiResult, setApiResult] =
		useState<null | TNerdyFinancePriceChartDataResult>(null);

	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	useEffect(() => {
		const handle = delayRender('FETCH_API_DATA');
		async function fetchAndSetData() {
			try {
				const response = await fetchNerdyFinancePriceChartData(
					{
						ticker,
						endDate,
						timePeriod,
					},
					nerdyFinanceEnv
				);
				setApiResult(response);
				continueRender(handle);
			} catch (error) {
				// Handle any errors
			}
		}
		fetchAndSetData();
		// }, [ticker, timePeriod, endDate, nerdyFinanceEnv]);
	}, []);

	if (!apiResult) {
		return <AbsoluteFill />;
	}

	// const percentageString = (apiResult?.percentageChange * 100).toFixed(2) + '%';

	const timeSeries = apiResult.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	const platteWidth = width * 0.9;
	const platteHeight = platteWidth * 0.61;

	return (
		<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
			<Position position={{left: 50, top: 50}}>
				<TitleSlide
					titleColor={theme.typography.titleColor}
					subTitleColor={theme.typography.subTitleColor}
					title={ticker}
					subTitle="Performance +80% (xx.xx.xx - xx.xx.xx)"
					titleFontSize={80}
					subTitleFontSize={40}
				/>
			</Position>
			<AbsoluteFill>
				<Position position={{left: 50, top: 280}}>
					<ObliquePlatte width={platteWidth} height={platteHeight}>
						<LineChartSingle
							width={platteWidth}
							height={platteHeight}
							timeSeries={timeSeries}
							theme={theme}
						/>
					</ObliquePlatte>
				</Position>
			</AbsoluteFill>
			<LorenzoBertoliniLogo />
		</AbsoluteFill>
	);
};

// TODO pass theme
export const ObliquePlatte: React.FC<{
	children: React.ReactNode;
	width: number;
	height: number;
}> = ({
	children,
	width,
	height,
	// themeEnum,
	// contentWidth,
	// theme,
}) => {
	// const { durationInFrames} = useVideoConfig();
	// TODO integrate into colorpalette
	// const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	// const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();

	// const aPerc = interpolate(frame, [0, durationInFrames], [0, 1]);
	// const aTranslateY = interpolate(aPerc, [0, 1], [100, -8550]);

	// const width = 700;

	// const padding = 10;
	// const contentWidthInner = contentWidth - 2 * padding;

	return (
		<div
			style={{
				perspective: '3000px',
				// perspective: '4000px',
				// perspective: '8000px',
				transformStyle: 'preserve-3d',
			}}
		>
			<div
				style={{
					// overflow: 'hidden',
					overflow: 'visible',
					backgroundColor: '#202020',
					borderRadius: 8,
					borderColor: '#292929',
					borderStyle: 'solid',
					borderWidth: 3,
					height,
					width,
					transform: `translateX(-20px) rotateX(${20}deg) rotateY(${-20}deg) rotateZ(${1}deg)`,
				}}
			>
				{children}
			</div>
		</div>
	);
};
