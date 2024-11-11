import {
	delayRender,
	continueRender,
	AbsoluteFill,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useEffect, useState} from 'react';

import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {
	fetchNerdyFinancePriceChartData,
	TNerdyFinancePriceChartDataResult,
} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {zNerdyTickers} from '../../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../../acetti-components/GlobalVideoContext';
import {TimeseriesAnimation} from './TimeseriesAnimation';

export const yScaleContextDevCompositionSchema = z.object({
	ticker: zNerdyTickers,
	timePeriod: z.enum(['1M', '3M', '1Y', '2Y', 'YTD', 'QTD']),
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
});

export const YScaleContextDevComposition: React.FC<
	z.infer<typeof yScaleContextDevCompositionSchema>
> = ({ticker, timePeriod, nerdyFinanceEnv, themeEnum}) => {
	// TODO actually get height and with as props
	const {height, width} = useVideoConfig();

	const today = new Date();
	const endDate = today.toISOString();

	const [apiResult, setApiResult] =
		useState<null | TNerdyFinancePriceChartDataResult>(null);

	const theme = useThemeFromEnum(themeEnum as any);

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

	return (
		<GlobalVideoContextWrapper>
			<PageContext
				width={width}
				height={height}
				margin={80}
				nrBaselines={40}
				theme={theme}
			>
				<Page>
					{({contentWidth, contentHeight}) => {
						return (
							<TimeseriesAnimation
								width={contentWidth}
								height={contentHeight}
								timeSeries={timeSeries}
								theme={theme}
							/>
						);
					}}
				</Page>
			</PageContext>
		</GlobalVideoContextWrapper>
	);
};

// {/* <TitleAndSubtitle
// 	title={'XAxisSpecDev TODO here showcase all xaxis specs'}
// 	titleColor={theme.typography.title.color}
// 	titleFontFamily={theme.typography.title.fontFamily}
// 	titleFontSize={60}
// 	subTitle={apiResult.tickerMetadata.name + apiResult.timePeriod}
// 	subTitleColor={theme.typography.subTitle.color}
// 	subTitleFontFamily={theme.typography.subTitle.fontFamily}
// 	subTitleFontSize={40}
// /> */}
