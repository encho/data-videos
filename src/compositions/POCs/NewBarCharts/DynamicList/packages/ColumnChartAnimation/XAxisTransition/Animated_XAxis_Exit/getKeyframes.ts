import {
	buildKeyFramesGroup,
	TKeyFrameSpec,
} from '../../../../../../Keyframes/Keyframes/keyframes';
import {TXAxisSpec} from './Animated_XAxis_Exit';

// TODO eventually as hook, as we can memoize labelStartKeyframes etc...
export function getKeyframes({
	fps,
	durationInFrames,
	xAxisSpec,
}: {
	fps: number;
	durationInFrames: number;
	xAxisSpec: TXAxisSpec;
}) {
	const labelDisappearKeyframes = [...xAxisSpec.labels]
		.reverse()
		.reduce<TKeyFrameSpec[]>((accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'SECOND',
					value: -0,
					id: `LABEL_DISAPPEAR__${currentItem.id}`,
				});
			} else {
				const previousLabelKeyframe = accumulator[accumulator.length - 1];

				accumulator.push({
					type: 'R_SECOND',
					value: -0.04,
					id: `LABEL_DISAPPEAR__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
			}
			return accumulator;
		}, []);

	const tickKeyframes = [...xAxisSpec.ticks].reverse().reduce<TKeyFrameSpec[]>(
		// const tickKeyframes = xAxisSpec.ticks.reduce<TKeyFrameSpec[]>(
		(accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'SECOND',
					value: -0,
					id: `TICK_EXIT_END__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.15,
					id: `TICK_EXIT_START__${currentItem.id}`,
					relativeId: `TICK_EXIT_END__${currentItem.id}`,
				});
			} else {
				const previousLabelKeyframe = accumulator[accumulator.length - 1];
				accumulator.push({
					type: 'R_SECOND',
					value: 0.05,
					id: `TICK_EXIT_END__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: -0.15,
					id: `TICK_EXIT_START__${currentItem.id}`,
					relativeId: `TICK_EXIT_END__${currentItem.id}`,
				});
			}
			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...labelDisappearKeyframes,
		...tickKeyframes,
		{
			type: 'SECOND',
			value: -0.3,
			id: `AXIS_LINE_EXIT_START`,
		},
		{
			type: 'SECOND',
			value: -0,
			id: `AXIS_LINE_EXIT_END`,
		},
	]);

	return keyframes;
}
