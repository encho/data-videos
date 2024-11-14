import {ScaleLinear} from 'd3-scale';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {TGridLayoutArea} from '../acetti-layout';
import {
	// getTimeSeriesInterpolatedExtentFromVisibleDomainIndices,
	getMultiTimeSeriesInterpolatedExtentFromVisibleDomainIndices,
} from '../acetti-ts-periodsScale/periodsScale';
import {ThemeType} from '../acetti-themes/themeTypes';

type TTheme_HighlightPeriodsArea =
	ThemeType['timeseriesComponents']['HighlightPeriodsArea'];

const defaultHightlightAreaTheme: TTheme_HighlightPeriodsArea = {
	backgroundColor: 'red',
	backgroundOpacity: 0.5,
	borderColor: 'yellow',
	textColor: 'yellow',
};

export const HighlightPeriodsMulti: React.FC<{
	timeSeries: {date: Date; value: number}[];
	timeSeries2: {date: Date; value: number}[];
	area: TGridLayoutArea;
	periodsScale: TPeriodsScale;
	domainIndices: [number, number];
	currentFrame: number;
	durationInFrames: number;
	fadeInDurationInFrames: number;
	yScaleCurrent: ScaleLinear<number, number>;
	label: string;
	theme?: TTheme_HighlightPeriodsArea;
}> = ({
	theme = defaultHightlightAreaTheme,
	label,
	timeSeries,
	timeSeries2,
	yScaleCurrent,
	area,
	periodsScale,
	domainIndices,
	fadeInDurationInFrames,
}) => {
	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const frame = useCurrentFrame();

	const {x1} = periodsScale.getBandFromIndex(domainIndices[0]);
	const {x2} = periodsScale.getBandFromIndex(domainIndices[1]);
	const width = x2 - x1;

	// const extent = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
	// 	timeSeries,
	// 	domainIndices
	// );

	const extent = getMultiTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
		// timeSeries,
		[timeSeries, timeSeries2],
		domainIndices
	);

	const paddedExtent = applyPaddingToExtent(extent, 0);
	// const paddedExtent = applyPaddingToExtent(extent, 0.2);

	const y1 = yScaleCurrent(paddedExtent[1]);
	const y2 = yScaleCurrent(paddedExtent[0]);

	const rectHeight = y2 - y1;

	const animatedOpacityRect = interpolate(
		frame,
		[0, fadeInDurationInFrames],
		[0, theme.backgroundOpacity],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const animatedOpacityLine = interpolate(
		frame,
		[0, fadeInDurationInFrames],
		[0, 1],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const FONT_SIZE = 24;

	const animatedTextYPosition = interpolate(
		frame,
		[0, fadeInDurationInFrames],
		[y1, y1 - FONT_SIZE / 2],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const animatedOpacityText = interpolate(
		frame,
		[0, fadeInDurationInFrames],
		[0, 1],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div style={{zIndex: 0}}>
			<svg
				overflow="visible"
				width={area.width}
				height={area.height}
				transform={`translate(${area.x1}, ${area.y1})`}
				// style={{backgroundColor: 'cyan', opacity: 0.5}}
			>
				<text
					textAnchor="start"
					alignmentBaseline="baseline"
					fill={theme.textColor}
					// fontFamily={fontFamilyXTicklabels}
					// fontSize={styling.xTickValuesFontSize}
					fontSize={36}
					y={animatedTextYPosition}
					x={x1}
					opacity={animatedOpacityText}
				>
					{label}
				</text>

				<rect
					rx={8}
					ry={8}
					x={x1}
					y={y1}
					width={width}
					height={rectHeight}
					fill={theme.backgroundColor}
					opacity={animatedOpacityRect}
				/>

				<rect
					rx={8}
					ry={8}
					x={x1}
					y={y1}
					width={width}
					height={rectHeight}
					fill="transparent"
					stroke={theme.borderColor}
					// stroke={'#neon-glow'}
					strokeWidth={2}
					opacity={animatedOpacityLine}
				/>
			</svg>
		</div>
	);
};

function applyPaddingToExtent(
	extent: [number, number],
	paddingPercent: number
): [number, number] {
	const distance = extent[1] - extent[0];
	const padding = paddingPercent * distance;
	const paddedExtent: [number, number] = [
		extent[0] - padding,
		extent[1] + padding,
	];
	return paddedExtent;
}
// // Example usage:
// const extent: [number, number] = [10, 20];
// const paddingPercent = 0.1; // 10% padding
// const newExtent = applyPaddingToExtent(extent, paddingPercent);
// console.log(newExtent); // Output: [9, 21]
