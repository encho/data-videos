import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TAxisSpec} from '../acetti-axis/axisSpec';

export const Transition_HorizontalDateAxis_Line: React.FC<{
	from: TAxisSpec;
	to: TAxisSpec;
	lineColor: string;
}> = ({from: startSpec, to: endSpec, lineColor}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	const axisStart_line_x1 = startSpec.scale(startSpec.domain[0]);
	const axisStart_line_x2 = startSpec.scale(startSpec.domain[1]);

	const axisEnd_line_x1 = endSpec.scale(endSpec.domain[0]);
	const axisEnd_line_x2 = endSpec.scale(endSpec.domain[1]);

	const aAxis_line_x1 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_line_x1, axisEnd_line_x1],
		{
			easing: Easing.bezier(0.25, 1, 0.5, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const aAxis_line_x2 = interpolate(
		animationPercentage,
		[0, 1],
		[axisStart_line_x2, axisEnd_line_x2],
		{
			easing: Easing.bezier(0.25, 1, 0.5, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<g>
			<line
				x1={aAxis_line_x1}
				x2={aAxis_line_x2}
				y1={0}
				y2={0}
				stroke={lineColor}
				// TODO strokeWidth as variable
				strokeWidth={4}
			/>
		</g>
	);
};
