// TODO bring into acetti-keyframes or acetti-animations
import {
	buildKeyFramesGroup,
	TKeyFrameSpec,
} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {TSimpleBarChartData} from './SimpleBarChart';

export function getSimpleBarChartKeyframes({
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
					value: 0.2,
					id: `LABEL_APPEAR__${currentItem.id}`,
					relativeId: previousLabelKeyframe.id,
				});
			}
			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...labelStartKeyframes,
	]);

	return keyframes;
}
