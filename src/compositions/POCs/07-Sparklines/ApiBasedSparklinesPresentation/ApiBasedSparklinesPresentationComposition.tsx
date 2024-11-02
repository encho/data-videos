import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';
// import invariant from 'tiny-invariant';
import {zColor} from '@remotion/zod-types';
import {zNerdyFinancePriceChartDataResult} from '../../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {LastLogoPage} from '../../03-Page/LastLogoPageContentDev/LastLogoPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SparklineLarge} from '../../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
// import {data} from './inflationData';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';

export const apiBasedSparklinesPresentationCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	data: z.array(zNerdyFinancePriceChartDataResult),
	dataInfo: z.array(
		z.object({ticker: z.string(), formatter: z.string(), color: zColor()})
	),
});

function getDataColor(
	dataInfo: {ticker: string; color: string; formatter: string}[],
	ticker: string
) {
	const color = dataInfo.find((it) => it.ticker === ticker)?.color || 'magenta';
	return color;
}

function getDataFormatter(
	dataInfo: {ticker: string; color: string; formatter: string}[],
	ticker: string
) {
	const color =
		dataInfo.find((it) => it.ticker === ticker)?.formatter || '0.00';
	return color;
}

export const ApiBasedSparklinesPresentationComposition: React.FC<
	z.infer<typeof apiBasedSparklinesPresentationCompositionSchema>
> = ({themeEnum, data, dataInfo}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	const singleDuration = Math.floor(fps * 7);
	const remainingDuration = durationInFrames - data.length * singleDuration;

	const getSequenceForIndex = (i: number) => {
		return {from: i * singleDuration, durationInFrames: singleDuration};
	};

	const lastSlideSequence = {
		from: singleDuration * 4,
		durationInFrames: remainingDuration,
	};

	return (
		<>
			{data.map((it, i) => {
				const ticker = it.ticker;
				const description = it.tickerMetadata.name;
				const sequence = getSequenceForIndex(i);

				const sparklineSlideData = it.data.map((it) => ({
					...it,
					date: it.index,
				}));

				const lineColor = getDataColor(dataInfo, ticker);
				const formatString = getDataFormatter(dataInfo, ticker);

				return (
					<Sequence key={ticker} layout="none" {...sequence}>
						<SingleSparklineSlide
							description={description}
							ticker={ticker}
							theme={theme}
							data={sparklineSlideData}
							lineColor={lineColor}
							formatString={formatString}
						/>
						;
					</Sequence>
				);
			})}
			<Sequence {...lastSlideSequence} layout="none">
				<LastLogoPage theme={theme} />
			</Sequence>
		</>
	);
};

export const SingleSparklineSlide: React.FC<{
	ticker: string;
	description: string;
	theme: ThemeType;
	data: TimeSeries;
	lineColor: string;
	formatString: string;
}> = ({ticker, description, theme, data, lineColor, formatString}) => {
	// const DEBUG = true;
	const DEBUG = false;

	const {ref, dimensions} = useElementDimensions();

	const {fps} = useVideoConfig();

	const baseline = theme.page.baseline * 2;

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 2000, // to better show grid rails!
		height: dimensions ? dimensions.height : 1000,
		nrColumns: 1,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 0,
		rowPaddingPixels: 0,
		columnPaddingPixels: theme.page.baseline * 0,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const domain = extent(data, (it) => it.value);

	return (
		<Page theme={theme}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader
					theme={theme}
					// showArea={DEBUG}
				>
					<TitleWithSubtitle
						title={ticker}
						subtitle={description}
						theme={theme}
					/>
				</PageHeader>

				<div
					ref={ref}
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{dimensions &&
					Math.round(matrixLayout.width) === Math.round(dimensions.width) ? (
						<Sequence from={Math.floor(fps * 0.75)} layout="none">
							<div style={{position: 'relative'}}>
								<DisplayGridRails
									{...matrixLayout}
									// stroke={theme.TypographicLayouts.gridLayout.lineColor}
									stroke={DEBUG ? '#292929' : 'transparent'}
								/>
								<HtmlArea area={area_1}>
									<Sequence from={0} layout="none">
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'001'}
												data={data}
												width={area_1.width}
												height={area_1.height}
												theme={theme}
												domain={domain as [number, number]}
												lineColor={lineColor}
												formatString={formatString}
												showLayout={DEBUG}
											/>
										</Sequence>
									</Sequence>
								</HtmlArea>
							</div>
						</Sequence>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter
					theme={theme}
					// showArea={showAreas}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<div
							style={{
								maxWidth: '62%',
								textWrap: 'pretty',
							}}
						>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={theme.page.baseline}
							>
								{'Data Source: Yahoo Finance'}
							</TypographyStyle>
						</div>
					</div>
					<PageLogo theme={theme} />
				</PageFooter>
			</div>
		</Page>
	);
};
