import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';
import {zColor} from '@remotion/zod-types';

import {Platte3D_SlideInAndOut} from '../../POCs/3D-Experiments/ShearedWrappers/Platte3D_SlideInAndOut';
import {PageContext, usePage} from '../../../acetti-components/PageContext';
import {
	zNerdyFinancePriceChartDataResult,
	TNerdyFinancePriceChartDataResult,
} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../acetti-components/Page';
import {NegativeBarChartPage} from '../../POCs/05-BarCharts/NegativeSimpleBarChart/NegativeBarChartPage';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {HtmlArea} from '../../../acetti-layout';
import {DisplayGridRails} from '../../../acetti-layout';
import {LastLogoPage} from '../../POCs/03-Page/LastLogoPageContentDev/LastLogoPage';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {SparklineLarge} from '../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../acetti-layout/hooks/useMatrixLayout';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {TimeSeries} from '../../../acetti-ts-utils/timeSeries/timeSeries';
import {
	zBarChartItems,
	TBarChartItems,
} from '../../POCs/NewBarCharts/DynamicList/packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';

export const selectedAssetsChartbookSchema = z.object({
	themeEnum: zThemeEnum,
	data: z.array(zNerdyFinancePriceChartDataResult),
	barChartData: zBarChartItems,
	dataInfo: z.array(z.object({ticker: z.string(), color: zColor()})),
	singleSparklineDurationInSeconds: z.number(),
	barChartDurationInSeconds: z.number(),
	lastSlideDurationInSeconds: z.number(),
	// TODO:
	// tickersArray: zNerdyTickers,
	// timePeriod: zNerdyTimePeriod
});

export type TSelectedAssetsChartbookSchema = z.infer<
	typeof selectedAssetsChartbookSchema
>;

type FlicProps = {
	theme: ThemeType;
	barChartData: TBarChartItems;
	dataInfo: {
		ticker: string;
		color: string;
	}[];
	data: TNerdyFinancePriceChartDataResult[];
	singleSparklineDurationInSeconds: number;
	barChartDurationInSeconds: number;
	lastSlideDurationInSeconds: number;
};

function getDataColor(
	dataInfo: {ticker: string; color: string}[],
	ticker: string
) {
	const color = dataInfo.find((it) => it.ticker === ticker)?.color || 'magenta';
	return color;
}

export const SelectedAssetsChartbookComposition: React.FC<
	z.infer<typeof selectedAssetsChartbookSchema>
> = ({
	themeEnum,
	data,
	dataInfo,
	singleSparklineDurationInSeconds,
	barChartDurationInSeconds,
	lastSlideDurationInSeconds,
	barChartData,
}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {width, height} = useVideoConfig();

	return (
		<div
			style={{
				width,
				height,
				backgroundColor: theme.typography.textStyles.h1.color,
			}}
		>
			<PageContext
				width={width}
				height={height}
				margin={60}
				nrBaselines={60}
				theme={theme}
			>
				<ApiBasedSparklinesPresentationFlic
					theme={theme}
					data={data}
					dataInfo={dataInfo}
					singleSparklineDurationInSeconds={singleSparklineDurationInSeconds}
					barChartDurationInSeconds={barChartDurationInSeconds}
					lastSlideDurationInSeconds={lastSlideDurationInSeconds}
					barChartData={barChartData}
				/>
			</PageContext>
		</div>
	);
};

export const ApiBasedSparklinesPresentationFlic: React.FC<FlicProps> = ({
	theme,
	data,
	dataInfo,
	singleSparklineDurationInSeconds,
	barChartDurationInSeconds,
	lastSlideDurationInSeconds,
	barChartData,
}) => {
	const {
		fps,
		// durationInFrames
	} = useVideoConfig();

	const singleDuration = Math.floor(fps * singleSparklineDurationInSeconds);

	const getSequenceForIndex = (i: number) => {
		const overlap = i > 0 ? Math.floor(fps * 0.3) : 0;

		return {
			from: i * singleDuration - overlap,
			durationInFrames: singleDuration + overlap,
		};
	};

	const barChartSlideSequence = {
		from: singleDuration * data.length,
		durationInFrames: barChartDurationInSeconds * fps,
	};

	const lastSlideSequence = {
		from: singleDuration * data.length + barChartDurationInSeconds * fps,
		durationInFrames: lastSlideDurationInSeconds * fps,
	};

	const valueLabelFormatter = (percReturn: number) => {
		const sign = percReturn > 0 ? '+' : '';
		return (
			sign +
			(percReturn * 100).toLocaleString(undefined, {
				minimumFractionDigits: 1,
				maximumFractionDigits: 1,
			}) +
			'%'
		);
	};

	return (
		<>
			{data.map((it, i) => {
				const {ticker} = it;
				const description = `3-Year Performance Overview`;
				const sequence = getSequenceForIndex(i);

				const sparklineSlideData = it.data.map((it) => ({
					...it,
					date: it.index,
				}));

				const lineColor = getDataColor(dataInfo, ticker);
				const formatString = it.tickerMetadata.price_format_string;

				return (
					<Sequence key={ticker} layout="none" {...sequence}>
						<SingleSparklineSlide
							title={it.tickerMetadata.name}
							description={description}
							theme={theme}
							data={sparklineSlideData}
							lineColor={lineColor}
							formatString={formatString}
						/>
						;
					</Sequence>
				);
			})}

			<Sequence {...barChartSlideSequence} layout="none">
				<NegativeBarChartPage
					title="Performance Overview"
					subtitle="3-Year Performance in %"
					theme={theme}
					data={barChartData}
					dataSource="Data Source: Yahoo Finance, own calculations."
					valueLabelFormatter={valueLabelFormatter}
					// tickLabelFormatter={tickLabelFormatter}
				/>
			</Sequence>

			<Sequence {...lastSlideSequence} layout="none">
				<LastLogoPage theme={theme} />
			</Sequence>
		</>
	);
};

export const SingleSparklineSlide: React.FC<{
	title: string;
	description: string;
	theme: ThemeType;
	data: TimeSeries;
	lineColor: string;
	formatString: string;
}> = ({title, description, theme, data, lineColor, formatString}) => {
	// const DEBUG = true;
	const DEBUG = false;

	const page = usePage();

	const {ref, dimensions} = useElementDimensions();

	const {fps} = useVideoConfig();

	const baseline = page.baseline * 1.75;

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 2000, // to better show grid rails!
		height: dimensions ? dimensions.height : 1000,
		nrColumns: 1,
		nrRows: 1,
		rowSpacePixels: 0,
		columnSpacePixels: 0,
		rowPaddingPixels: 0,
		columnPaddingPixels: page.baseline * 0,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const domain = extent(data, (it) => it.value);

	return (
		<Platte3D_SlideInAndOut width={page.width} height={page.height}>
			<Page>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						position: 'relative',
					}}
				>
					<PageHeader>
						<TitleWithSubtitle
							title={title}
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
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id="001"
												data={data}
												width={area_1.width}
												height={area_1.height}
												theme={theme}
												domain={domain as [number, number]}
												lineColor={lineColor}
												formatString={formatString}
												showLayout={DEBUG}
												xAxisFormatString="MMM yy"
											/>
										</Sequence>
									</HtmlArea>
								</div>
							</Sequence>
						) : null}
					</div>

					{/* TODO introduce evtl. also absolute positioned footer */}
					<PageFooter>
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
									baseline={page.baseline}
								>
									Data Source: Yahoo Finance
								</TypographyStyle>
							</div>
						</div>
						<PageLogo />
					</PageFooter>
				</div>
			</Page>
		</Platte3D_SlideInAndOut>
	);
};
