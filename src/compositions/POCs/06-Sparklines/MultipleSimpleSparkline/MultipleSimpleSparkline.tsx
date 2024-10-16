import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';
import {extent} from 'd3-array';

import {EconomistDataSource} from '../../04-BarCharts/EconomistDataSource';
import {HtmlArea} from '../../../../acetti-layout';
import {DisplayGridRails} from '../../../../acetti-layout';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SparklineLarge} from '../../../../acetti-ts-flics/single-timeseries/SparklineLarge/SparklineLarge';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {
	getMatrixLayoutCellArea,
	useMatrixLayout,
} from '../../../../acetti-layout/hooks/useMatrixLayout';
// import {data} from './data';
import {data} from './inflationData';

export const multipleSimpleSparklineCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleSparklineComposition: React.FC<
	z.infer<typeof multipleSimpleSparklineCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps, width} = useVideoConfig();

	const props = data;

	const matrixLayout = useMatrixLayout({
		width: width - 4, // to better show grid rails!
		// width, TODO enable when we are not showing gridlayout any more
		height: 630,
		nrColumns: 2,
		nrRows: 2,
		rowSpacePixels: 130,
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
		height: 50,
		fontSize: 40,
		marginBottom: 65,
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
			<SlideTitle theme={theme}>{props.title}</SlideTitle>

			<div style={{position: 'relative'}}>
				<DisplayGridRails
					{...matrixLayout}
					// stroke={theme.TypographicLayouts.gridLayout.lineColor}
					// stroke={'#292929'}
					stroke={'transparent'}
				/>
				<HtmlArea area={area_1}>
					<Sequence from={fps * 1} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>
								{props.sparklines[0].title}
							</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
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
								showLayout={false}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_2}>
					<Sequence from={Math.floor(fps * 4.5)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>
								{props.sparklines[1].title}
							</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
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
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_3}>
					<Sequence from={Math.floor(fps * 8)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>
								{props.sparklines[2].title}
							</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
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
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_4}>
					<Sequence from={Math.floor(fps * 11.5)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>
								{props.sparklines[3].title}
							</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
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
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
			</div>

			<EconomistDataSource theme={theme}>
				{props.dataSource}
			</EconomistDataSource>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
