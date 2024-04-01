import {
	AbsoluteFill,
	delayRender,
	continueRender,
	useVideoConfig,
	// useCurrentFrame,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';
// import {find} from 'lodash';

// import {SimpleLineChart} from '../SimpleLineChart/SimpleLineChart';
import {AnimatedLineChart2} from '../AnimatedLineChartScaleBand/AnimatedLineChart';

// import availableFontSpecs from '../fontSpecs';
// import {useFontsLoader} from '../useFontsLoader';

// TODOS
// performance in title
// api: deploy
// update env flags to use deployed apis too
// api: return the correct title and subtitle
// animate logo
// improve x axis to account for series length flexibly
// logo becomes action card
// add tooltip which becomes flag
// toggle screen size?
// nice to have: automatically determine necessary space for y axis
// add performance information (in title, like the image?)

// const nerdyThemeDark = {
// 	background: '#000000',
// 	title: '#ffffff',
// 	text: '#ffffff',
// 	softText: '#666666',
// 	green: '#00FED8',
// 	magenta: '#FE0097',
// 	gridLines: '#222',
// 	line: '#00FED8',
// 	xTicks: '#444444',
// };

export const nerdyPriceChartSchema2 = z.object({
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

export const NerdyPriceChart2: React.FC<
	z.infer<typeof nerdyPriceChartSchema2>
> = ({
	title,
	subtitle,
	ticker,
	showZero,
	timePeriod,
	nerdyFinanceEnv,
	styling = {},
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

	// const theme = nerdyThemeDark;

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

	// const defaultStyling = {
	// 	titleFontSize: 50,
	// 	subTitleFontSize: 40,
	// 	backgroundColor: theme.background,
	// 	titleColor: theme.title,
	// 	gridLinesColor: theme.gridLines,
	// 	yLabelsColor: theme.softText,
	// 	xLabelsColor: theme.softText,
	// 	xTickValuesColor: theme.xTicks,
	// 	lineColor: theme.line,
	// 	yAxisAreaWidth: 128,
	// 	lineStrokeWidth: 4,
	// 	lineCircleRadius: 10,
	// 	yTickValuesFontSize: 40,
	// 	xTickValuesFontSize: 40,
	// 	xAxisAreaHeight: 60,
	// 	gridLinesStrokeWidth: 3,
	// 	yAxisAreaMarginLeft: 20,
	// 	xTickValuesLength: 15,
	// 	xTickValuesWidth: 2,
	// };

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
			/>
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
