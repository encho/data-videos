import {
	buildKeyFramesGroup,
	TKeyFrameSpec,
} from '../../../../../../Keyframes/Keyframes/keyframes';
import {TXAxisSpec} from './Animated_XAxis_Enter';

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
	const labelEnterKeyframes = xAxisSpec.labels.reduce<TKeyFrameSpec[]>(
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
					value: 0.04,
					id: `LABEL_APPEAR__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
			}
			return accumulator;
		},
		[]
	);

	const tickKeyframes = xAxisSpec.ticks.reduce<TKeyFrameSpec[]>(
		(accumulator, currentItem, index) => {
			if (index === 0) {
				accumulator.push({
					type: 'SECOND',
					value: 0,
					id: `TICK_ENTER_START__${currentItem.id}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0.15,
					id: `TICK_ENTER_END__${currentItem.id}`,
					relativeId: `TICK_ENTER_START__${currentItem.id}`,
				});
			} else {
				const previousLabelKeyframe = accumulator[accumulator.length - 1];
				accumulator.push({
					type: 'R_SECOND',
					value: -0,
					id: `TICK_ENTER_START__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0.15,
					id: `TICK_ENTER_END__${currentItem.id}`,
					relativeId: `TICK_ENTER_START__${currentItem.id}`,
				});
			}
			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...labelEnterKeyframes,
		...tickKeyframes,
		{
			type: 'SECOND',
			value: 0,
			id: `AXIS_LINE_ENTER_START`,
		},
		{
			type: 'R_SECOND',
			value: 0.3,
			id: `AXIS_LINE_ENTER_END`,
			relativeId: `AXIS_LINE_ENTER_START`,
		},
	]);

	return keyframes;
}
