import {range} from 'lodash';
import {Sequence} from 'remotion';
import {useVideoConfig, useCurrentFrame, interpolate, Easing} from 'remotion';

import {ThemeType} from '../../../../acetti-themes/themeTypes';

export const VerticalBaselineGrid: React.FC<
	ThemeType['TypographicLayouts']['baselineGrid'] & {
		width: number;
		height: number;
		baseline: number;
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
	}
> = ({
	width,
	height,
	baseline,
	lineColor,
	// stroke: lineColor,
	// stroke = 'magenta',
	strokeWidth = 2, // TODO include default value in Theme styles...
	fill = 'transparent', // TODO include default vvalue in Theme styles
}) => {
	const {fps} = useVideoConfig();

	return (
		<div style={{position: 'absolute', top: 0, left: 0}}>
			<svg
				width={width}
				height={height}
				style={{
					backgroundColor: fill,
					overflow: 'visible',
				}}
			>
				{range(0, width + baseline, baseline).map((xPosition, i) => {
					const lineDelay = Math.floor(fps * 0.05 * i);
					return (
						<Sequence
							layout="none"
							name={`vertical-baselinegrid-${i}`}
							from={lineDelay}
						>
							<BaselineLine
								x1={xPosition}
								x2={xPosition}
								y1={0}
								y2={height}
								stroke={lineColor}
								strokeWidth={strokeWidth}
							/>
						</Sequence>
					);
				})}
			</svg>
		</div>
	);
};

export const BaselineLine: React.FC<{
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	stroke: string;
	strokeWidth: number;
	entryDurationInSeconds?: number;
}> = ({x1, x2, y1, y2, stroke, strokeWidth, entryDurationInSeconds = 0.6}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const entryDurationInFrames = Math.floor(fps * entryDurationInSeconds);

	const opacity = interpolate(frame, [0, entryDurationInFrames - 1], [0, 1], {
		easing: Easing.ease,
	});

	const translateX = interpolate(
		frame,
		[0, Math.floor(entryDurationInFrames / 3) - 1],
		[300, 0],
		{
			easing: Easing.ease,
		}
	);

	return (
		<g transform={`translate(0,${translateX})`}>
			<line
				opacity={opacity}
				x1={x1}
				x2={x2}
				y1={y1}
				y2={y2}
				stroke={stroke}
				strokeWidth={strokeWidth}
			/>
		</g>
	);
};
