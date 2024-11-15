import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../acetti-layout';

import {usePage} from '../../../../acetti-components/PageContext';
import {Position} from '../../../../acetti-layout/atoms/Position';
// import {TPeriodsScale} from '../../../../acetti-ts-periodsScale/periodsScale';

import {ThemeType} from '../../../../acetti-themes/themeTypes';

// TODO evtl. deprecate, try to not export
export type Theme_PercentageChangeArea =
	ThemeType['timeseriesComponents']['percentageChangeArea'];

export const Animated_PercentageChangeArea: React.FC<{
	yScale: ScaleLinear<number, number>; // TODO poass context
	area: TGridLayoutArea;
	firstValue: number;
	lastValue: number;
	// enterDurationInFrames: number; TODO re-enactivate
}> = ({yScale, area, firstValue, lastValue}) => {
	const currentFrame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const {theme: fullTheme} = usePage();

	const theme = fullTheme.timeseriesComponents.percentageChangeArea;

	// TODO address typography!
	// TODO address multicolor requirement (green/red e.g.)
	const {lineColor, gradientColor, textColor, lineStrokeWidth} = theme;
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
				left: area.x1,
				top: area.y1,
			}}
		>
			<svg
				style={{
					// backgroundColor: 'cyan',
					// opacity: easingPercentage,
					width: area.width,
					height: area.height,
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
					width={area.width}
					height={mappedFirstValue - mappedAnimatedLastValue}
					fill="url(#greenGradient)"
					opacity={0.2}
				/>

				<line
					x1={0}
					x2={area.width}
					y1={mappedFirstValue}
					y2={mappedFirstValue}
					strokeWidth={lineStrokeWidth}
					stroke={lineColor}
				/>

				<line
					x1={0}
					x2={area.width}
					y1={mappedAnimatedLastValue}
					y2={mappedAnimatedLastValue}
					strokeWidth={lineStrokeWidth}
					stroke={lineColor}
				/>

				<g>
					<text
						y={mappedAnimatedLastValue + textBottomMargin} // TODO textTopMargin
						x={textBottomMargin} // TODO textLeftMargin
						style={{fontSize: 60, fontWeight}}
						fill={textColor}
						opacity={aPerc}
						dominantBaseline="hanging"
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
	const percentage = value * 100;
	// Round to the nearest integer and format with a sign
	// Directly use `toFixed(0)` which handles rounding
	return (percentage > 0 ? '+' : '') + percentage.toFixed(0) + '%';
}
// Usage examples:
// console.log(formatPercentage(1.23));  // Outputs: "+123%"
// console.log(formatPercentage(-0.5));  // Outputs: "-50%"
