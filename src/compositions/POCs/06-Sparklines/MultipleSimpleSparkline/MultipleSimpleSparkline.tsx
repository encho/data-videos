import {z} from 'zod';
import {
	Sequence,
	useVideoConfig,
	Easing,
	interpolate,
	useCurrentFrame,
} from 'remotion';

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
	// {value: 60, date: new Date('2019-12-31')},
	// {value: 64, date: new Date('2020-12-31')},
	// {value: 118, date: new Date('2021-12-31')},
	// {value: 94, date: new Date('2022-12-31')},
	// {value: 127, date: new Date('2023-12-31')},
	// {value: 68, date: new Date('2024-12-31')},
	// {value: 40, date: new Date('2025-12-31')},
	// {value: 88, date: new Date('2026-12-31')},
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
	// {value: 85, date: new Date('2019-12-31')},
	// {value: 200, date: new Date('2020-12-31')},
	// {value: 65, date: new Date('2021-12-31')},
	// {value: 170, date: new Date('2022-12-31')},
	// {value: 60, date: new Date('2023-12-31')},
	// {value: 140, date: new Date('2024-12-31')},
	// {value: 100, date: new Date('2025-12-31')},
	// {value: 180, date: new Date('2026-12-31')},
];

export const multipleSimpleSparklineCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const MultipleSimpleSparklineComposition: React.FC<
	z.infer<typeof multipleSimpleSparklineCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {
		fps,
		// durationInFrames,
		width,
	} = useVideoConfig();
	// const frame = useCurrentFrame();

	// const opacity = interpolate(
	// 	frame,
	// 	[0, fps * 2.0, durationInFrames - fps * 0.3, durationInFrames - 1],
	// 	[0, 1, 1, 0],
	// 	{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.ease}
	// );

	const matrixLayout = useMatrixLayout({
		width: width - 4, // to better show grid rails!
		// width, TODO enable when we are not showing gridlayout any more
		// height: 500,
		height: 700,
		nrColumns: 2,
		nrRows: 2,
		rowSpacePixels: 20,
		columnSpacePixels: 100,
		rowPaddingPixels: 20,
		columnPaddingPixels: 100,
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

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Sparkline Multiples</SlideTitle>

			<div style={{position: 'relative'}}>
				<DisplayGridRails
					{...matrixLayout}
					// stroke={theme.TypographicLayouts.gridLayout.lineColor}
					stroke={'#404040'}
				/>
				<HtmlArea area={area_1}>
					<Sequence from={fps * 1.5} layout="none">
						<SparklineLarge
							id={'001'}
							data={timeSeries}
							width={area_1.width}
							height={area_1.height}
							theme={theme}
							domain={[40, 200]}
							lineColor={neonColors.neonGreen}
							showLayout={false}
						/>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_2}>
					<Sequence from={Math.floor(fps * 4.5)} layout="none">
						<SparklineLarge
							id={'002'}
							data={timeSeriesComparison}
							width={area_2.width}
							height={area_2.height}
							theme={theme}
							domain={[40, 200]}
							lineColor={neonColors.neonBlue}
							// showLayout={true}
						/>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_3}>
					<Sequence from={Math.floor(fps * 4.5)} layout="none">
						<SparklineLarge
							id={'003'}
							data={timeSeriesComparison}
							width={area_3.width}
							height={area_3.height}
							theme={theme}
							domain={[40, 200]}
							lineColor={neonColors.neonOrange}
							// showLayout={true}
						/>
					</Sequence>
				</HtmlArea>
				<HtmlArea area={area_4}>
					<Sequence from={Math.floor(fps * 4.5)} layout="none">
						<SparklineLarge
							id={'004'}
							data={timeSeries}
							width={area_4.width}
							height={area_4.height}
							theme={theme}
							domain={[40, 200]}
							lineColor={neonColors.neonPink}
							// showLayout={true}
						/>
					</Sequence>
				</HtmlArea>
			</div>
			{/* <div
					style={{
						position: 'relative',
						width: matrixLayout.width,
						height: matrixLayout.height,
					}}
				>
					<div style={{position: 'absolute', top: 0, left: 0}}>
					</div> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
