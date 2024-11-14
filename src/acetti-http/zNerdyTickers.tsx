import {z} from 'zod';

export const zNerdyTickers = z.enum([
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
]);

export const zNerdyTimePeriod = z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']);

export type TNerdyTimePeriod = z.infer<typeof zNerdyTimePeriod>;
