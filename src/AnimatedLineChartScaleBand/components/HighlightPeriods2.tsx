// import {ScaleLinear} from 'd3-scale';
// import {line} from 'd3-shape';

import {ScaleLinear} from 'd3-scale';
import {Easing, interpolate} from 'remotion';

import {TPeriodsScale} from '../periodsScale/periodsScale';
import {TGridLayoutArea} from '../../acetti-viz';
import {getYDomain} from '../utils/timeSeries/timeSeries';

export type TTheme_HighlightArea = {
	backgroundColor: string;
	backgroundOpacity: number;
	borderColor: string;
	textColor: string;
};

const defaultHightlightAreaTheme = {
	backgroundColor: 'red',
	backgroundOpacity: 0.5,
	borderColor: 'yellow',
	textColor: 'yellow',
};

export const HighlightPeriods2: React.FC<{
	timeSeries: {date: Date; value: number}[];
	area: TGridLayoutArea;
	periodsScale: TPeriodsScale;
	domainIndices: [number, number];
	currentFrame: number;
	durationInFrames: number;
	fadeInDurationInFrames: number;
	yScaleCurrent: ScaleLinear<number, number>;
	label: string;
	theme?: TTheme_HighlightArea;
}> = ({
	theme = defaultHightlightAreaTheme,
	label,
	timeSeries,
	yScaleCurrent,
	area,
	periodsScale,
	domainIndices,
	currentFrame,
	durationInFrames,
	fadeInDurationInFrames,
}) => {
	const EASING_FUNCTION = Easing.bezier(0.33, 1, 0.68, 1);

	const x1 = periodsScale.getBandFromIndex(domainIndices[0]).x1;
	const x2 = periodsScale.getBandFromIndex(domainIndices[1]).x2;
	const width = x2 - x1;

	const yDomain = getYDomain(
		'VISIBLE',
		timeSeries,
		domainIndices,
		periodsScale
	);
	const y1 = yScaleCurrent(yDomain[1]);
	const y2 = yScaleCurrent(yDomain[0]);
	const rectHeight = y2 - y1;

	const animatedOpacityRect = interpolate(
		currentFrame,
		[0, durationInFrames - fadeInDurationInFrames, durationInFrames],
		[0, 0, theme.backgroundOpacity],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const FONT_SIZE = 24;

	const animatedTextYPosition = interpolate(
		currentFrame,
		[0, durationInFrames - fadeInDurationInFrames, durationInFrames],
		[0, y1, y1 - FONT_SIZE / 2],
		{
			easing: EASING_FUNCTION,
			// in this case should not be necessary
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div style={{zIndex: 0}}>
			<svg overflow="visible" width={area.width} height={area.height}>
				<text
					textAnchor="start"
					alignmentBaseline="baseline"
					fill={theme.textColor}
					// fontFamily={fontFamilyXTicklabels}
					// fontSize={styling.xTickValuesFontSize}
					fontSize={24}
					y={animatedTextYPosition}
					x={x1}
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
					strokeWidth={2}
					// opacity={animatedOpacityRect}
				/>
			</svg>
		</div>
	);
};
