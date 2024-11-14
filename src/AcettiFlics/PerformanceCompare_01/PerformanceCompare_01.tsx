import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import {
	// getThemeFromEnum,
	useThemeFromEnum,
} from '../../acetti-themes/getThemeFromEnum';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {TitleAndSubtitle} from '../../acetti-components/TitleAndSubtitle';
import {Position} from '../../acetti-ts-base/Position';
import {zNerdyTickers} from '../../acetti-http/zNerdyTickers';
import {ObliquePlatte} from '../../acetti-components/ObliquePlatte';
import {GlobalVideoContextWrapper} from '../../acetti-components/GlobalVideoContext';
import {PerformanceCompare_01} from '../../acetti-ts-flics/single-timeseries/PerformanceCompare_01/PerformanceCompare_01';

import {
	fetchNerdyFinancePerformanceCompareData,
	TNerdyFinancePerformanceCompareChartDataResult,
} from '../../acetti-http/nerdy-finance/fetchPerformanceCompareData';

export const performanceCompare_01_example_schema = z.object({
	ticker: zNerdyTickers,
	ticker2: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const PerformanceCompare_01_Example: React.FC<
	z.infer<typeof performanceCompare_01_example_schema>
> = ({ticker, ticker2, timePeriod, nerdyFinanceEnv, themeEnum}) => {
	// TODO actually get height and with as props
	const {width} = useVideoConfig();

	const today = new Date();
	const endDate = today.toISOString();

	const [apiResult, setApiResult] =
		useState<null | TNerdyFinancePerformanceCompareChartDataResult>(null);

	const theme = useThemeFromEnum(themeEnum);

	useEffect(() => {
		const handle = delayRender('FETCH_API_DATA');
		async function fetchAndSetData() {
			try {
				const response = await fetchNerdyFinancePerformanceCompareData(
					{
						ticker,
						ticker2,
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

	const multiSeries = apiResult.data;

	const dates = multiSeries.index;
	const series1 = multiSeries.series[0];
	const series2 = multiSeries.series[1];

	const timeSeries: {date: Date; value: number}[] = [];
	const timeSeries2: {date: Date; value: number}[] = [];

	dates.forEach((date, i) => {
		timeSeries.push({value: series1[i], date});
		timeSeries2.push({value: series2[i], date});
	});

	console.log({timeSeries});

	// const timeSeries = multiSeries.map((it) => ({
	// 	value: it.value,
	// 	date: new Date(it.index),
	// }));

	const platteWidth = width * 0.9;
	const platteHeight = platteWidth * 0.61;

	return (
		<GlobalVideoContextWrapper>
			<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
				<Position position={{left: 50, top: 50}}>
					<TitleAndSubtitle
						// title={apiResult.tickerMetadata.name}
						title="Title"
						titleColor={theme.typography.title.color}
						titleFontFamily={theme.typography.title.fontFamily}
						titleFontSize={60}
						// subTitle={apiResult.timePeriod}
						subTitle="Subtitle"
						subTitleColor={theme.typography.subTitle.color}
						subTitleFontFamily={theme.typography.subTitle.fontFamily}
						subTitleFontSize={40}
					/>
				</Position>
				<AbsoluteFill>
					<Position position={{left: 50, top: 280}}>
						<ObliquePlatte
							width={platteWidth}
							height={platteHeight}
							theme={theme.platte}
						>
							<PerformanceCompare_01
								width={platteWidth}
								height={platteHeight}
								timeSeries={timeSeries}
								timeSeries2={timeSeries2}
								// TODO temporary solution until we fetch the right data from nerdy
								// timeSeries2={timeSeries.map((it) => ({
								// 	...it,
								// 	value: it.value * 1.05,
								// }))}
								theme={theme}
							/>
						</ObliquePlatte>
					</Position>
				</AbsoluteFill>
				<LorenzoBertoliniLogo color={theme.typography.logoColor} />
			</AbsoluteFill>
		</GlobalVideoContextWrapper>
	);
};
