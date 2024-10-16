import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

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

const timeSeries = [
	{value: 150, date: new Date('2010-12-31')},
	{value: 57, date: new Date('2011-12-31')},
	{value: 58, date: new Date('2012-12-31')},
	{value: 65, date: new Date('2013-12-31')},
	{value: 77, date: new Date('2014-12-31')},
	{value: 94, date: new Date('2015-12-31')},
	{value: 91, date: new Date('2016-12-31')},
	{value: 65, date: new Date('2017-12-31')},
	{value: 114, date: new Date('2018-12-31')},
];

const timeSeriesComparison = [
	{value: 180, date: new Date('2010-12-31')},
	{value: 95, date: new Date('2011-12-31')},
	{value: 160, date: new Date('2012-12-31')},
	{value: 130, date: new Date('2013-12-31')},
	{value: 175, date: new Date('2014-12-31')},
	{value: 45, date: new Date('2015-12-31')},
	{value: 190, date: new Date('2016-12-31')},
	{value: 70, date: new Date('2017-12-31')},
	{value: 150, date: new Date('2018-12-31')},
];

const timeSeriesComparisonVariant = [
	{value: 170, date: new Date('2010-12-31')},
	{value: 105, date: new Date('2011-12-31')},
	{value: 150, date: new Date('2012-12-31')},
	{value: 120, date: new Date('2013-12-31')},
	{value: 165, date: new Date('2014-12-31')},
	{value: 55, date: new Date('2015-12-31')},
	{value: 180, date: new Date('2016-12-31')},
	{value: 80, date: new Date('2017-12-31')},
	{value: 140, date: new Date('2018-12-31')},
];

// const timeSeriesComparisonAnotherVariant = [
// 	{value: 160, date: new Date('2010-12-31')},
// 	{value: 115, date: new Date('2011-12-31')},
// 	{value: 140, date: new Date('2012-12-31')},
// 	{value: 135, date: new Date('2013-12-31')},
// 	{value: 155, date: new Date('2014-12-31')},
// 	{value: 50, date: new Date('2015-12-31')},
// 	{value: 175, date: new Date('2016-12-31')},
// 	{value: 85, date: new Date('2017-12-31')},
// 	{value: 130, date: new Date('2018-12-31')},
// ];

const timeSeriesComparisonDistinct1 = [
	{value: 50, date: new Date('2010-12-31')}, // Starting low
	{value: 140, date: new Date('2011-12-31')}, // Sharp rise
	{value: 80, date: new Date('2012-12-31')}, // Dip
	{value: 180, date: new Date('2013-12-31')}, // Sharp rise
	{value: 100, date: new Date('2014-12-31')}, // Moderate drop
	{value: 160, date: new Date('2015-12-31')}, // Another rise
	{value: 60, date: new Date('2016-12-31')}, // Sharp drop
	{value: 180, date: new Date('2017-12-31')}, // Sharp rise again
	{value: 120, date: new Date('2018-12-31')}, // Leveling out
];

const timeSeriesComparisonDistinct2 = [
	{value: 190, date: new Date('2010-12-31')}, // Starting high
	{value: 70, date: new Date('2011-12-31')}, // Sharp drop
	{value: 110, date: new Date('2012-12-31')}, // Gradual recovery
	{value: 50, date: new Date('2013-12-31')}, // Drop again
	{value: 150, date: new Date('2014-12-31')}, // Sharp rise
	{value: 130, date: new Date('2015-12-31')}, // Moderate drop
	{value: 175, date: new Date('2016-12-31')}, // Rise again
	{value: 95, date: new Date('2017-12-31')}, // Drop
	{value: 180, date: new Date('2018-12-31')}, // Recovery with a peak
];

export const multipleSimpleSparklineCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleSparklineComposition: React.FC<
	z.infer<typeof multipleSimpleSparklineCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps, width} = useVideoConfig();

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

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Wohnungskosten pro &#13217;</SlideTitle>

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
							<WaterfallTextEffect>Hamburg</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
								id={'001'}
								data={timeSeries}
								width={area_1.width}
								height={
									area_1.height -
									sparklineTitleProps.fontSize -
									sparklineTitleProps.marginBottom
								}
								theme={theme}
								domain={[40, 200]}
								lineColor={neonColors.neonGreen}
								showLayout={false}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_2}>
					<Sequence from={Math.floor(fps * 4.5)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>Berlin</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
								id={'002'}
								data={timeSeriesComparison}
								width={area_2.width}
								height={
									area_2.height -
									sparklineTitleProps.fontSize -
									sparklineTitleProps.marginBottom
								}
								theme={theme}
								domain={[40, 200]}
								lineColor={neonColors.neonBlue}
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_3}>
					<Sequence from={Math.floor(fps * 8)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>München</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
								id={'003'}
								data={timeSeriesComparisonDistinct1}
								width={area_3.width}
								height={
									area_3.height -
									sparklineTitleProps.fontSize -
									sparklineTitleProps.marginBottom
								}
								theme={theme}
								domain={[40, 200]}
								lineColor={neonColors.neonOrange}
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_4}>
					<Sequence from={Math.floor(fps * 11.5)} layout="none">
						<div style={sparklineTitleProps}>
							<WaterfallTextEffect>Stuttgart</WaterfallTextEffect>
						</div>
						<Sequence from={Math.floor(90 * 0.75)} layout="none">
							<SparklineLarge
								id={'004'}
								data={timeSeriesComparisonDistinct2}
								width={area_4.width}
								height={
									area_4.height -
									sparklineTitleProps.fontSize -
									sparklineTitleProps.marginBottom
								}
								theme={theme}
								domain={[40, 200]}
								lineColor={neonColors.neonPink}
								// showLayout={true}
							/>
						</Sequence>
					</Sequence>
				</HtmlArea>
			</div>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
