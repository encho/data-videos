import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';

import {EconomistDataSource} from '../../04-BarCharts/EconomistDataSource';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SparklineLarge} from '../../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
import {EconomistTitleWithSubtitle} from '../../04-BarCharts/EconomistTitleWithSubtitle';
import {useFontFamiliesLoader} from '../../../../acetti-typography/new/useFontFamiliesLoader';

import {data} from './inflationData';

export const multipleSimpleSparklineCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleSparklineComposition: React.FC<
	z.infer<typeof multipleSimpleSparklineCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const {fps, width} = useVideoConfig();

	const baseline = 20;

	const props = data;

	const matrixLayout = useMatrixLayout({
		width: width - 4, // to better show grid rails!
		// width, TODO enable when we are not showing gridlayout any more
		height: 540,
		nrColumns: 2,
		nrRows: 2,
		rowSpacePixels: 80,
		columnSpacePixels: 200,
		rowPaddingPixels: 0,
		columnPaddingPixels: 220,
	});

	const area_1 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 0,
		column: 0,
	});

	const area_2 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 0,
		column: 1,
	});

	const area_3 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 1,
		column: 0,
	});

	const area_4 = getMatrixLayoutCellArea({
		layout: matrixLayout,
		cellName: 'cell',
		row: 1,
		column: 1,
	});

	const neonColors = {
		neonGreen: '#39FF14',
		neonPink: '#FF6EC7',
		neonBlue: '#0D98BA',
		neonOrange: '#FF5F1F',
	};

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

	console.log({commonDomain});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<EconomistTitleWithSubtitle
				title={props.title}
				subtitle={props.subtitle}
				theme={theme}
			/>

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
							<div style={sparklineTitleProps}>
								<WaterfallTextEffect>
									{props.sparklines[0].title}
								</WaterfallTextEffect>
							</div>
							<Sequence from={Math.floor(90 * 0.0)} layout="none">
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
									lineColor={neonColors.neonGreen}
									formatString="0.00 %"
									// showLayout={true}
								/>
							</Sequence>
						</Sequence>
					</HtmlArea>
					<HtmlArea area={area_2}>
						<Sequence from={Math.floor(fps * 3.5)} layout="none">
							<div style={sparklineTitleProps}>
								<WaterfallTextEffect>
									{props.sparklines[1].title}
								</WaterfallTextEffect>
							</div>
							<Sequence from={Math.floor(90 * 0.0)} layout="none">
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
									lineColor={neonColors.neonBlue}
									formatString="0.00 %"
									// showLayout={true}
								/>
							</Sequence>
						</Sequence>
					</HtmlArea>
					<HtmlArea area={area_3}>
						<Sequence from={Math.floor(fps * 7)} layout="none">
							<div style={sparklineTitleProps}>
								<WaterfallTextEffect>
									{props.sparklines[2].title}
								</WaterfallTextEffect>
							</div>
							<Sequence from={Math.floor(90 * 0.0)} layout="none">
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
									lineColor={neonColors.neonOrange}
									formatString="0.00 %"
									// showLayout={true}
								/>
							</Sequence>
						</Sequence>
					</HtmlArea>
					<HtmlArea area={area_4}>
						<Sequence from={Math.floor(fps * 10.5)} layout="none">
							<div style={sparklineTitleProps}>
								<WaterfallTextEffect>
									{props.sparklines[3].title}
								</WaterfallTextEffect>
							</div>
							<Sequence from={Math.floor(90 * 0.0)} layout="none">
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
									lineColor={neonColors.neonPink}
									formatString="0.00 %"
									// showLayout={true}
								/>
							</Sequence>
						</Sequence>
					</HtmlArea>
				</div>
			</Sequence>

			<EconomistDataSource theme={theme}>
				{props.dataSource}
			</EconomistDataSource>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
