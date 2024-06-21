import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import {useThemeFontsLoader} from '../../acetti-themes/useThemeTypograpyLoader';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {Position} from '../../acetti-ts-base/Position';
import {
	fetchNerdyFinancePriceChartData,
	TNerdyFinancePriceChartDataResult,
} from '../../acetti-http/fetchNerdyFinancePriceChartData';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {zNerdyTickers} from '../../acetti-http/zNerdyTickers';
import {ObliquePlatte} from '../../acetti-components/ObliquePlatte';
import {GlobalVideoContextWrapper} from '../../acetti-components/GlobalVideoContext';
import {Performance_01} from '../../acetti-ts-flics/single-timeseries/Performance_01/Performance_01';
import {TitleAndSubtitle} from '../../acetti-components/TitleAndSubtitle';

export const performance_01_example_schema = z.object({
	ticker: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const Performance_01_Example: React.FC<
	z.infer<typeof performance_01_example_schema>
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

	// TODO generalize and factor out // bring into wrapper component?
	useThemeFontsLoader(theme);

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

	const timeSeries = apiResult.data.map((it) => ({
		value: it.value,
		date: new Date(it.index),
	}));

	const platteWidth = width * 0.9;
	const platteHeight = platteWidth * 0.61;

	return (
		<GlobalVideoContextWrapper>
			<AbsoluteFill style={{backgroundColor: theme.global.backgroundColor}}>
				<Position position={{left: 50, top: 50}}>
					<TitleAndSubtitle
						title={apiResult.tickerMetadata.name}
						titleColor={theme.typography.title.color}
						titleFontFamily={theme.typography.title.fontFamily}
						titleFontSize={60}
						subTitle={apiResult.timePeriod}
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
