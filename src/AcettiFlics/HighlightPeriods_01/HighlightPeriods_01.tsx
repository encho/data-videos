import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {TitleSlide} from './TitleSlide';
import {Position} from '../../AnimatedLineChartScaleBand/components/Position';
import {
	fetchNerdyFinancePriceChartData,
	TNerdyFinancePriceChartDataResult,
} from './fetchNerdyFinancePriceChartData';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {zNerdyTickers} from './zNerdyTickers';
import {ObliquePlatte} from './ObliquePlatte';
import {GlobalVideoContextWrapper} from '../../acetti-components/GlobalVideoContext';
import {Performance_01} from '../../acetti-ts-flics/single-timeseries/Performance_01/Performance_01';

export const highlightPeriods_01_example_schema = z.object({
	ticker: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const HighlightPeriods_01_Example: React.FC<
	z.infer<typeof highlightPeriods_01_example_schema>
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

	const theme =
		themeEnum === 'NERDY'
			? nerdyTheme
			: themeEnum === 'LORENZOBERTOLINI'
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

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

	console.log({apiResult});

	return (
		<GlobalVideoContextWrapper>
			<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
				<Position position={{left: 50, top: 50}}>
					<TitleSlide
						titleColor={theme.typography.titleColor}
						subTitleColor={theme.typography.subTitleColor}
						title={apiResult.tickerMetadata.name}
						subTitle={apiResult.timePeriod}
						titleFontSize={60}
						subTitleFontSize={40}
						titleFontWeight={600}
						subTitleFontWeight={400}
					/>
				</Position>
				<AbsoluteFill>
					<Position position={{left: 50, top: 280}}>
						<ObliquePlatte
							width={platteWidth}
							height={platteHeight}
							theme={theme.platte}
						>
							<Performance_01
								width={platteWidth}
								height={platteHeight}
								timeSeries={timeSeries}
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
