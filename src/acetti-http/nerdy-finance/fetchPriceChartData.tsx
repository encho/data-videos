import {z} from 'zod';
import {format} from 'date-fns';
import {enGB} from 'date-fns/locale';
import numeral from 'numeral';

export const zNerdyFinancePriceChartDataResult = z.object({
	title: z.string(),
	subtitle: z.string(),
	ticker: z.string(),
	tickerMetadata: z.object({
		ticker: z.string(),
		quote: z.string(),
		name: z.string(),
		type: z.string(),
		price_format_string: z.string(),
	}),
	percentageChange: z.number(),
	timePeriod: z.string(),
	data: z.array(
		z.object({
			value: z.number(),
			index: z.date(),
		})
	),
});

export type TNerdyFinancePriceChartDataResult = z.infer<
	typeof zNerdyFinancePriceChartDataResult
>;

type NerdyFinancePriceChartsArgs = {
	ticker: string;
	endDate: string | Date;
	timePeriod: '1M' | '3M' | '1Y' | '2Y' | '3Y' | 'YTD' | 'QTD';
};

export const fetchNerdyFinancePriceChartData = async (
	{ticker, endDate: endDateProp, timePeriod}: NerdyFinancePriceChartsArgs,
	nerdyFinanceEnv: 'DEV' | 'STAGE' | 'PROD'
): Promise<TNerdyFinancePriceChartDataResult> => {
	const apiBase =
		nerdyFinanceEnv === 'DEV'
			? 'http://127.0.0.1:5000'
			: nerdyFinanceEnv === 'STAGE'
			? 'https://coinfolio-quant-stage.onrender.com'
			: 'https://coinfolio-quant.onrender.com';

	const endDateString =
		typeof endDateProp === 'string' ? endDateProp : endDateProp.toISOString();

	const apiUrl = `${apiBase}/flics/simple-price-chart?ticker=${ticker}&&endDate=${endDateString}&timePeriod=${timePeriod}`;
	const data = await fetch(apiUrl);
	const json = await data.json();

	// TODO validate a specific return type
	// maybe with zod it is possible?
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

const formatDate = (date: Date): string => {
	return format(date, 'P', {locale: enGB}); // Formats to '1. Jan. 2024'
};

export const getSubtitle = (
	nerdyPriceApiResult: TNerdyFinancePriceChartDataResult
) => {
	const startDate = nerdyPriceApiResult.data[0].index;
	const endDate =
		nerdyPriceApiResult.data[nerdyPriceApiResult.data.length - 1].index;
	const periodString = `(${formatDate(startDate)}-${formatDate(endDate)})`;

	if (nerdyPriceApiResult.timePeriod === '1M') {
		return `1-Month Performance ${periodString}`;
	}

	if (nerdyPriceApiResult.timePeriod === '3M') {
		return `3-Month Performance ${periodString}`;
	}

	if (nerdyPriceApiResult.timePeriod === '1Y') {
		return `1-Year Performance ${periodString}`;
	}

	if (nerdyPriceApiResult.timePeriod === '2Y') {
		return `2-Year Performance ${periodString}`;
	}

	if (nerdyPriceApiResult.timePeriod === 'YTD') {
		return `Year-to-Date Performance ${periodString}`;
	}

	if (nerdyPriceApiResult.timePeriod === 'QTD') {
		return `Quarter-to-Date Performance ${periodString}`;
	}

	return 'Implement subtitle for this timePeriod!!!';
};

export const getTickLabelFormatter = (
	nerdyPriceApiResult: TNerdyFinancePriceChartDataResult
) => {
	return (tick: number) =>
		numeral(tick).format(
			nerdyPriceApiResult.tickerMetadata.price_format_string
		);
};
