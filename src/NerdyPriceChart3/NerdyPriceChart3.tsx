import {
	AbsoluteFill,
	delayRender,
	continueRender,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';
import {zColor} from '@remotion/zod-types';

// import {SimpleLineChart} from '../SimpleLineChart/SimpleLineChart';
import {AnimatedLineChart2} from '../AnimatedLineChartScaleBand/AnimatedLineChart';
import {lorenzobertoliniTheme} from '../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../acetti-themes/nerdy';
import {DataColors} from './DataColors';

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

export const nerdyPriceChartSchema3 = z.object({
	ticker: z.enum([
		'BTC-USD',
		'XAU-USD',
		'ETH-USD',
		'XRP-USD',
		'USDT-USD',
		'BNB-USD',
		'ADA-USD',
		'GBP-USD',
		'EUR-USD',
		'JPY-USD',
		'AUD-USD',
		'NZD-USD',
		'EUR-CHF',
		'USD-RUB',
		'FTSE_INDEX',
		'DAX_INDEX',
		'^N100',
		'SPX_INDEX',
		'DJI_INDEX',
		'NIKKEI_INDEX',
		'AAPL',
		'AMZN',
		'COIN',
		'PFE',
		'GS',
		'JPM',
		'TESLA',
	]),
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
	// theme: zTheme.optional(),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI']),
});

type TNerdyPriceChartApiResult = {
	title: string;
	subtitle: string;
	ticker: string;
	tickerMetadata: {
		ticker: string;
		quote: string;
		name: string;
		type: string;
	};
	percentageChange: number;
	timePeriod: string;
	data: {value: number; index: Date}[];
};

export const NerdyPriceChart3: React.FC<
	z.infer<typeof nerdyPriceChartSchema3>
> = ({
	title,
	subtitle,
	ticker,
	showZero,
	timePeriod,
	nerdyFinanceEnv,
	styling = {},
	themeEnum,
}) => {
	// const frame = useCurrentFrame();
	const {height, width} = useVideoConfig();

	// const lineChartWidth = width;
	// const lineChartHeight = height * 0.9;

	const today = new Date();
	const endDate = today.toISOString();

	const [apiResult, setApiResult] = useState<null | TNerdyPriceChartApiResult>(
		null
	);

	const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;

	useEffect(() => {
		const handle = delayRender('FETCH_API_DATA');
		async function fetchAndSetData() {
			try {
				const response = await fetchNerdyFinancePriceCharts(
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

	// const mergedStyling = {...defaultStyling, ...styling};

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
			<AnimatedLineChart2
				backgroundColor="#f05122"
				textColor="#fff"
				axisSpecType="STANDARD"
				width={width}
				// height={height}
				height={height * 0.7}
				timeSeries={timeSeries}
				theme={theme}
			/>
			<DataColors />
			{/* <DataColors dataColors={theme.dataColors}/> */}
		</AbsoluteFill>
	);
};

type NerdyFinancePriceChartsArgs = {
	ticker: string;
	endDate: string;
	timePeriod: '1M' | '3M' | '1Y' | '2Y' | 'YTD' | 'QTD';
};

const fetchNerdyFinancePriceCharts = async (
	{ticker, endDate, timePeriod}: NerdyFinancePriceChartsArgs,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyPriceChartApiResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	const apiUrl = `${apiBase}/flics/simple-price-chart?ticker=${ticker}&&endDate=${endDate}&timePeriod=${timePeriod}`;

	console.log(apiUrl);

	const data = await fetch(apiUrl);

	const json = await data.json();

	// TODO validate a specific return type
	// maybe with zod it is possible?
	// TODO parse within the component!
	const parsedData = json.data.map((it: {value: number; index: string}) => ({
		value: it.value,
		index: new Date(it.index),
	}));

	return {
		data: parsedData,
		title: json.title,
		ticker: json.ticker,
		timePeriod: json.time_period,
		percentageChange: json.percentage_change,
		subtitle: json.subtitle,
		tickerMetadata: json.ticker_metadata,
	};
};
