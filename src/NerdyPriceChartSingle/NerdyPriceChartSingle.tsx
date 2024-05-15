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
import {ObliquePlatte} from './ObliquePlatte';

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

	console.log({apiResult});

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
					title={
						apiResult.tickerMetadata.name +
						' ' +
						apiResult.timePeriod +
						' Performance'
					}
					subTitle={`${formatPercentage(apiResult.percentageChange)}`}
					titleFontSize={60}
					subTitleFontSize={100}
				/>
			</Position>
			<AbsoluteFill>
				<Position position={{left: 50, top: 280}}>
					<ObliquePlatte
						width={platteWidth}
						height={platteHeight}
						theme={theme.platte}
					>
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

function formatPercentage(value: number): string {
	// Calculate the percentage by multiplying the value by 100
	let percentage = value * 100;
	// Round to the nearest integer and format with a sign
	// Directly use `toFixed(0)` which handles rounding
	return (percentage > 0 ? '+' : '') + percentage.toFixed(0) + '%';
}
// Usage examples:
// console.log(formatPercentage(1.23));  // Outputs: "+123%"
// console.log(formatPercentage(-0.5));  // Outputs: "-50%"
