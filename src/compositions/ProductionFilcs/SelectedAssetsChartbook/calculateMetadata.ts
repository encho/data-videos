import {fetchNerdyFinancePriceChartData} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {getThemeFromEnum} from '../../../acetti-themes/getThemeFromEnum';
import {getPercentageChange} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {TSelectedAssetsChartbookSchema} from './SelectedAssetsChartbookComposition';

export const calculateMetadata = async ({
	props,
}: {
	props: TSelectedAssetsChartbookSchema;
}) => {
	const nerdyENV = 'STAGE';

	const spx = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'SPX_INDEX',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);

	const dax = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'DAX_INDEX',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);

	const btcusd = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'BTC-USD',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);

	const xauusd = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'XAU-USD',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);
	const ethusd = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'ETH-USD',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);

	const tesla = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'TESLA',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);
	const amazon = await fetchNerdyFinancePriceChartData(
		{
			ticker: 'AMZN',
			endDate: new Date(),
			timePeriod: '3Y',
		},
		nerdyENV
	);

	const data = [
		// stocks
		spx,
		dax,
		// commodities,
		xauusd,
		// crypto
		btcusd,
		ethusd,
		// stocks,
		tesla,
		amazon,
	];

	const fps = 30;
	const singleDurationInSeconds = props.singleSparklineDurationInSeconds;
	const singleDurationInFrames = singleDurationInSeconds * fps;

	const sparklinesTotalDuration = data.length * singleDurationInFrames;

	const percentageComparisonDurationInFrames =
		fps * props.barChartDurationInSeconds;
	const lastSlideTotalDurationInFrames = fps * props.lastSlideDurationInSeconds;

	const durationInFrames =
		sparklinesTotalDuration +
		lastSlideTotalDurationInFrames +
		percentageComparisonDurationInFrames;

	const theme = getThemeFromEnum(props.themeEnum);
	const {positiveColor, negativeColor} = theme.positiveNegativeColors;

	const returnComparisonBarChartData = data.map((it) => {
		const percReturn = getPercentageChange(
			it.data.map((dataItem) => ({
				...dataItem,
				date: dataItem.index,
			}))
		);

		return {
			label: it.tickerMetadata.name,
			value: percReturn,
			color: percReturn >= 0 ? positiveColor : negativeColor,
			id: it.ticker,
		};
	});

	const barChartData = returnComparisonBarChartData.sort(
		(a, b) => b.value - a.value
	);

	// const forChat = barChartData.map((it) => {
	// 	return {
	// 		asset: it.label,
	// 		percentagePerformanceInLast3Years: it.value * 100,
	// 	};
	// });
	// console.log({forChat});

	return {
		durationInFrames,
		props: {
			...props,
			data,
			barChartData,
			dataInfo: [
				{
					ticker: 'SPX_INDEX',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'DAX_INDEX',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'XAU-USD',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'BTC-USD',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'ETH-USD',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'TESLA',
					color: theme.typography.textStyles.h1.color,
				},
				{
					ticker: 'AMZN',
					color: theme.typography.textStyles.h1.color,
				},
			],
		},
	};
};
