import {buildKeyFramesGroup} from '../../../compositions/POCs/Keyframes/Keyframes/keyframes';

export function getLargeSparklineKeyFrames({
	fps,
	durationInFrames,
}: {
	fps: number;
	durationInFrames: number;
}) {
	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		{
			type: 'FRAME',
			value: -0,
			id: 'X_AXIS_END',
		},
		{
			// type: 'R_SECOND',
			type: 'SECOND',
			value: 0,
			id: 'LEFT_VALUE_ENTER',
			// relativeId: 'X_AXIS_ENTER_END',
		},
		{
			type: 'SECOND',
			value: -1,
			id: 'LEFT_VALUE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -1,
			id: 'LEFT_VALUE_EXIT_START',
			relativeId: 'LEFT_VALUE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'SPARKLINE_ENTER',
			relativeId: 'LEFT_VALUE_ENTER',
		},
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'SPARKLINE_ENTER_END',
			relativeId: 'SPARKLINE_ENTER',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'SPARKLINE_END',
		},
		{
			type: 'R_SECOND',
			value: -0.3,
			id: 'SPARKLINE_EXIT_START',
			relativeId: 'LEFT_VALUE_EXIT_END',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'RIGHT_VALUE_END',
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: 'RIGHT_VALUE_START',
			relativeId: 'SPARKLINE_ENTER_END',
		},
		// axis
		{
			type: 'R_SECOND',
			value: 0,
			id: 'X_AXIS_ENTER_START',
			relativeId: 'SPARKLINE_ENTER_END',
		},
		{
			type: 'R_SECOND',
			value: 1.3,
			id: 'X_AXIS_ENTER_END',
			relativeId: 'X_AXIS_ENTER_START',
		},
	]);

	return keyframes;
}
