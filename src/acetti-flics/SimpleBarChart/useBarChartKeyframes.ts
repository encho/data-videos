// TODO bring into acetti-keyframes or acetti-animations
import {
	buildKeyFramesGroup,
	TKeyFrameSpec,
} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {TSimpleBarChartData} from './SimpleBarChart';

export function useBarChartKeyframes({
	fps,
	durationInFrames,
	data,
}: {
	fps: number;
	durationInFrames: number;
	data: TSimpleBarChartData;
}) {
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
					value: 0.05,
					id: `LABEL_APPEAR__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
			}
			return accumulator;
		},
		[]
	);

	const barKeyframes = data.reduce<TKeyFrameSpec[]>(
		(accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'R_SECOND',
					value: 0.5,
					id: `BAR_ENTER_START__${currentItem.id}`,
					relativeId: labelStartKeyframes[labelStartKeyframes.length - 1].id,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0.5,
					id: `BAR_ENTER_END__${currentItem.id}`,
					relativeId: `BAR_ENTER_START__${currentItem.id}`,
				});
				accumulator.push({
					type: 'SECOND',
					value: -0,
					id: `BAR_EXIT_END__${currentItem.id}`,
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
			} else {
				// const previousLabelKeyframe = accumulator[accumulator.length - 1];

				accumulator.push({
					type: 'R_SECOND',
					value: 0.2,
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
					type: 'SECOND',
					value: -0,
					id: `BAR_EXIT_END__${currentItem.id}`,
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
			}
			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...labelStartKeyframes,
		// ...valueLabelStartKeyframes,
		...barKeyframes,
	]);

	return keyframes;
}
