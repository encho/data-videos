// TODO bring into acetti-keyframes or acetti-animations
import {
	buildKeyFramesGroup,
	TKeyFramesGroup,
	TKeyFrameSpec,
} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {TSimpleBarChartData} from './SimpleBarChart';

// TODO fps and durationInframes can be taken from useVideoConfig!!!
export function useBarChartKeyframes({
	fps,
	durationInFrames,
	data,
	keyframes: keyframesProp,
}: {
	fps: number;
	durationInFrames: number;
	data: TSimpleBarChartData;
	keyframes?: TKeyFramesGroup;
}) {
	if (keyframesProp) {
		return keyframesProp;
	}

	const labelStartKeyframes = data.reduce<TKeyFrameSpec[]>(
		(accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'SECOND',
					value: 0,
					id: `LABEL_APPEAR__${currentItem.id}`,
				});
			} else {
				const previousLabelKeyframe = accumulator[accumulator.length - 1];

				accumulator.push({
					type: 'R_SECOND',
					value: 0.025,
					id: `LABEL_APPEAR__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
			}
			return accumulator;
		},
		[]
	);

	const zeroLineKeyframes: TKeyFrameSpec[] = [
		{
			type: 'R_SECOND',
			value: 0.2,
			id: `ZEROLINE_ENTER_START`,
			relativeId: labelStartKeyframes[labelStartKeyframes.length - 1].id,
		},
		{
			type: 'R_SECOND',
			value: 0.75,
			id: `ZEROLINE_ENTER_END`,
			relativeId: `ZEROLINE_ENTER_START`,
		},
		{
			type: 'SECOND',
			value: -0,
			id: `ZEROLINE_EXIT_END`,
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: `ZEROLINE_EXIT_START`,
			relativeId: `ZEROLINE_EXIT_END`,
		},
	];

	const barKeyframes = data.reduce<TKeyFrameSpec[]>(
		(accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'R_SECOND',
					value: 0.075,
					id: `BAR_ENTER_START__${currentItem.id}`,
					relativeId: 'ZEROLINE_ENTER_END',
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0.5,
					id: `BAR_ENTER_END__${currentItem.id}`,
					relativeId: `BAR_ENTER_START__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.05,
					id: `BAR_EXIT_END__${currentItem.id}`,
					relativeId: 'ZEROLINE_EXIT_START',
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.5,
					id: `BAR_EXIT_START__${currentItem.id}`,
					relativeId: `BAR_EXIT_END__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.4,
					id: `VALUE_LABEL_APPEAR__${currentItem.id}`,
					relativeId: `BAR_ENTER_END__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.1,
					id: `VALUE_LABEL_DISSAPPEAR__${currentItem.id}`,
					relativeId: `BAR_EXIT_END__${currentItem.id}`,
				});
			} else {
				// const previousLabelKeyframe = accumulator[accumulator.length - 1];

				accumulator.push({
					type: 'R_SECOND',
					value: 0.05,
					id: `BAR_ENTER_START__${currentItem.id}`,
					relativeId: `BAR_ENTER_START__${data[index - 1].id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0.5,
					id: `BAR_ENTER_END__${currentItem.id}`,
					relativeId: `BAR_ENTER_START__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.05,
					id: `BAR_EXIT_END__${currentItem.id}`,
					relativeId: 'ZEROLINE_EXIT_START',
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.5,
					id: `BAR_EXIT_START__${currentItem.id}`,
					relativeId: `BAR_EXIT_END__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.4,
					id: `VALUE_LABEL_APPEAR__${currentItem.id}`,
					relativeId: `BAR_ENTER_END__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.1,
					id: `VALUE_LABEL_DISSAPPEAR__${currentItem.id}`,
					relativeId: `BAR_EXIT_END__${currentItem.id}`,
				});
			}
			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...labelStartKeyframes,
		...zeroLineKeyframes,
		...barKeyframes,
	]);

	return keyframes;
}
