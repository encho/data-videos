import {
	AbsoluteFill,
	delayRender,
	continueRender,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';
import {zColor} from '@remotion/zod-types';

import {
	fetchNerdyFinancePriceChartData,
	TNerdyFinancePriceChartDataResult,
} from './fetchNerdyFinancePriceChartData';
import {LineChartSingle} from '../AnimatedLineChartScaleBand/flics/LineChartSingle/LineChartSingle';
import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {zNerdyTickers} from './zNerdyTickers';

// TODO import from centralized place
export const zTheme = z.object({
	global: z.object({
		backgroundColor: zColor(),
	}),
	yAxis: z.object({
		fontSize: z.number(),
		strokeWidth: z.number(),
		color: zColor(),
		tickColor: zColor(),
	}),
	xAxis: z.object({
		fontSize: z.number(),
		strokeWidth: z.number(),
		color: zColor(),
		tickColor: zColor(),
	}),
	candlesticks: z.object({
		up: z.object({
			bodyColor: zColor(),
			bodyStrokeColor: zColor(),
			lineColor: zColor(),
			strokeWidth: z.number(),
		}),
		down: z.object({
			bodyColor: zColor(),
			bodyStrokeColor: zColor(),
			lineColor: zColor(),
			strokeWidth: z.number(),
		}),
	}),
	dataColors: z.array(
		z.object({
			M3: zColor(),
			M2: zColor(),
			M1: zColor(),
			BASE: zColor(),
			P1: zColor(),
			P2: zColor(),
			P3: zColor(),
		})
	),
	minimap: z.object({
		lineColor: zColor(),
		areaColor: zColor(),
		areaOpacity: z.number(),
	}),
	highlightArea: z.object({
		backgroundColor: zColor(),
		backgroundOpacity: z.number(),
		borderColor: zColor(),
		textColor: zColor(),
	}),
});

export type TTheme = z.infer<typeof zTheme>;

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
	const {height, width} = useVideoConfig();

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

	return (
		<AbsoluteFill>
			<LineChartSingle
				width={width}
				height={height * 0.5}
				timeSeries={timeSeries}
				theme={theme}
			/>
		</AbsoluteFill>
	);
};
