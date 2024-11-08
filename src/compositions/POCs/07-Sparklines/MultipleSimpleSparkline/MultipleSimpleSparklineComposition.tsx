import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';

import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {PageContext, usePage} from '../../../../acetti-components/PageContext';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../../acetti-components/Page';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
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
import {data} from './inflationData';

export const multipleSimpleSparklineCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleSparklineComposition: React.FC<
	z.infer<typeof multipleSimpleSparklineCompositionSchema>
> = ({themeEnum}) => {
	const {height, width} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<PageContext
			width={width}
			// height={height * 0.7}
			height={height}
			margin={80}
			nrBaselines={50}
		>
			<MultipleSimpleSparklineFlic theme={theme} />
		</PageContext>
	);
};

export const MultipleSimpleSparklineFlic: React.FC<{theme: ThemeType}> = ({
	theme,
}) => {
	const {ref, dimensions} = useElementDimensions();

	const {fps} = useVideoConfig();

	const page = usePage();

	const baseline = 26;

	const props = data;

	const matrixLayout = useMatrixLayout({
		width: dimensions ? dimensions.width : 2000, // to better show grid rails!
		height: dimensions ? dimensions.height : 1000,
		nrColumns: 2,
		nrRows: 2,
		rowSpacePixels: 80,
		columnSpacePixels: 200,
		rowPaddingPixels: 0,
		columnPaddingPixels: 220,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});

	const area_2 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});

	const area_3 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 0,
	});

	const area_4 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 1,
	});

	const sparklineColors = {
		0: theme.data.tenColors[0].main,
		1: theme.data.tenColors[0].main,
		2: theme.data.tenColors[0].main,
		3: theme.data.tenColors[0].main,
	};

	// TODO measure capHeight rather...
	const sparklineTitleProps = {
		height: baseline * 2.5,
		fontSize: baseline * 2,
		marginBottom: baseline * 2,
		color: 'white',
		width: '100%',
		fontFamily: 'Inter-Bold',
	};

	const ts1Extent = extent(props.sparklines[0].timeseries, (it) => it.value);
	const ts2Extent = extent(props.sparklines[1].timeseries, (it) => it.value);
	const ts3Extent = extent(props.sparklines[2].timeseries, (it) => it.value);
	const ts4Extent = extent(props.sparklines[3].timeseries, (it) => it.value);

	const min = Math.min(
		ts1Extent[0] as number,
		ts2Extent[0] as number,
		ts3Extent[0] as number,
		ts4Extent[0] as number
	);

	const max = Math.max(
		ts1Extent[1] as number,
		ts2Extent[1] as number,
		ts3Extent[1] as number,
		ts4Extent[1] as number
	);

	const commonDomain = [min, max] as [number, number];

	return (
		<Page theme={theme} show>
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
					// showArea={showAreas}
				>
					<TitleWithSubtitle
						title={props.title}
						subtitle={props.subtitle}
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
									// stroke={'#292929'}
									stroke={'transparent'}
								/>
								<HtmlArea area={area_1}>
									<Sequence from={0} layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.body}
											baseline={baseline}
											marginBottom={2}
										>
											<WaterfallTextEffect>
												{props.sparklines[0].title}
											</WaterfallTextEffect>
										</TypographyStyle>

										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'001'}
												data={props.sparklines[0].timeseries}
												width={area_1.width}
												height={
													area_1.height -
													sparklineTitleProps.fontSize -
													sparklineTitleProps.marginBottom
												}
												theme={theme}
												domain={commonDomain}
												lineColor={sparklineColors[0]}
												formatString="0.00 %"
												// showLayout={true}
											/>
										</Sequence>
									</Sequence>
								</HtmlArea>
								<HtmlArea area={area_2}>
									<Sequence from={Math.floor(fps * 3.5)} layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.body}
											baseline={baseline}
											marginBottom={2}
										>
											<WaterfallTextEffect>
												{props.sparklines[1].title}
											</WaterfallTextEffect>
										</TypographyStyle>
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'002'}
												data={props.sparklines[1].timeseries}
												width={area_2.width}
												height={
													area_2.height -
													sparklineTitleProps.fontSize -
													sparklineTitleProps.marginBottom
												}
												theme={theme}
												domain={commonDomain}
												lineColor={sparklineColors[1]}
												formatString="0.00 %"
												// showLayout={true}
											/>
										</Sequence>
									</Sequence>
								</HtmlArea>
								<HtmlArea area={area_3}>
									<Sequence from={Math.floor(fps * 7)} layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.body}
											baseline={baseline}
											marginBottom={2}
										>
											<WaterfallTextEffect>
												{props.sparklines[2].title}
											</WaterfallTextEffect>
										</TypographyStyle>
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'003'}
												data={props.sparklines[2].timeseries}
												width={area_3.width}
												height={
													area_3.height -
													sparklineTitleProps.fontSize -
													sparklineTitleProps.marginBottom
												}
												theme={theme}
												domain={commonDomain}
												lineColor={sparklineColors[2]}
												formatString="0.00 %"
												// showLayout={true}
											/>
										</Sequence>
									</Sequence>
								</HtmlArea>
								<HtmlArea area={area_4}>
									<Sequence from={Math.floor(fps * 10.5)} layout="none">
										<TypographyStyle
											typographyStyle={theme.typography.textStyles.body}
											baseline={baseline}
											marginBottom={2}
										>
											<WaterfallTextEffect>
												{props.sparklines[3].title}
											</WaterfallTextEffect>
										</TypographyStyle>
										<Sequence from={Math.floor(fps * 0.0)} layout="none">
											<SparklineLarge
												baseline={baseline}
												id={'004'}
												data={props.sparklines[3].timeseries}
												width={area_4.width}
												height={
													area_4.height -
													sparklineTitleProps.fontSize -
													sparklineTitleProps.marginBottom
												}
												theme={theme}
												domain={commonDomain}
												lineColor={sparklineColors[3]}
												formatString="0.00 %"
												// showLayout={true}
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
								baseline={page.baseline}
							>
								{props.dataSource}
							</TypographyStyle>
						</div>
					</div>
					<PageLogo theme={theme} />
				</PageFooter>
			</div>
		</Page>
	);
};
