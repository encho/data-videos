import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../acetti-layout';

import {Position} from '../../../components/Position';
import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';

import {ThemeType} from '../../../../acetti-themes/themeTypes';

export type Theme_PercentageChangeArea =
	ThemeType['timeseriesComponents']['percentageChangeArea'];

export const PercentageChangeArea: React.FC<{
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	easingPercentage: number;
	plotArea: TGridLayoutArea;
	// TODO deprecate?
	enterDurationInFrames: number;
	firstValue: number;
	lastValue: number;
	theme: Theme_PercentageChangeArea;
}> = ({
	// periodsScale,
	// easingPercentage,
	// enterDurationInFrames,
	yScale,
	plotArea,
	firstValue,
	lastValue,
	theme,
}) => {
	const currentFrame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// TODO address typography!
	// TODO address multicolor requirement (green/red e.g.)
	const lineColor = theme.lineColor;
	const gradientColor = theme.gradientColor;
	const textColor = theme.textColor;
	const lineStrokeWidth = theme.lineStrokeWidth;
	const fontWeight = 600;

	const textBottomMargin = 12;

	const aPerc = spring({
		frame: currentFrame,
		fps,
		config: {
			damping: 18,
			mass: 0.5,
			stiffness: 27,
		},
		durationInFrames: 48,
	});

	const aLastValue = firstValue + aPerc * (lastValue - firstValue);

	const mappedFirstValue = yScale(firstValue);
	const mappedAnimatedLastValue = yScale(aLastValue);

	const aPercentageChange = aLastValue / firstValue - 1;

	return (
		<Position
			position={{
				left: plotArea.x1,
				top: plotArea.y1,
			}}
		>
			<svg
				style={{
					// backgroundColor: 'cyan',
					// opacity: easingPercentage,
					width: plotArea.width,
					height: plotArea.height,
					overflow: 'visible',
				}}
			>
				<defs>
					{/* <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%"> */}
					<linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop
							offset="0%"
							// style={{stopColor: 'rgb(0,255,0)', stopOpacity: 1}}
							style={{stopColor: gradientColor, stopOpacity: 1}}
						/>
						<stop
							offset="100%"
							// offset="50%"
							// style={{stopColor: 'rgb(0,255,0)', stopOpacity: 0}}
							style={{stopColor: gradientColor, stopOpacity: 0.2}}
						/>
					</linearGradient>
				</defs>
				<rect
					x={0}
					y={mappedAnimatedLastValue}
					width={plotArea.width}
					height={mappedFirstValue - mappedAnimatedLastValue}
					fill={'url(#greenGradient)'}
					opacity={0.2}
				/>

				<line
					x1={0}
					x2={plotArea.width}
					y1={mappedFirstValue}
					y2={mappedFirstValue}
					strokeWidth={lineStrokeWidth}
					stroke={lineColor}
				/>

				<line
					x1={0}
					x2={plotArea.width}
					y1={mappedAnimatedLastValue}
					y2={mappedAnimatedLastValue}
					strokeWidth={lineStrokeWidth}
					stroke={lineColor}
				/>

				<g
					transform={`translate(0,${
						mappedAnimatedLastValue - textBottomMargin
					})`}
				>
					<text
						style={{fontSize: 60, fontWeight}}
						fill={textColor}
						opacity={aPerc}
					>
						{formatPercentage(aPercentageChange)}
					</text>
				</g>
				{/* <g transform="translate(0,130)">
					<text>{durationInFrames}</text>
				</g> */}
			</svg>
		</Position>
	);
};

// TODO centralize
function formatPercentage(value: number): string {
	// Calculate the percentage by multiplying the value by 100
	let percentage = value * 100;
	// Round to the nearest integer and format with a sign
	// Directly use `toFixed(0)` which handles rounding
	return (percentage > 0 ? '+' : '') + percentage.toFixed(0) + '%';
}
// Usage examples:
// console.log(formatPercentage(1.23));  // Outputs: "+123%"
// console.log(formatPercentage(-0.5));  // Outputs: "-50%"
