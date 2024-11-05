import {
	buildKeyFramesGroup,
	TKeyFramesGroup,
	TKeyFrameSpec,
} from '../../Keyframes/Keyframes/keyframes';

// TODO fps and durationInframes can be taken from useVideoConfig!!!
export function useBarChartRaceKeyframes({
	fps,
	durationInFrames,
	dataIds,
	keyframes: keyframesProp,
}: // animateExit = true,
{
	fps: number;
	durationInFrames: number;
	dataIds: string[];
	keyframes?: TKeyFramesGroup;
	// animateExit?: boolean;
}) {
	if (keyframesProp) {
		return keyframesProp;
	}

	// TODO only if length > 1
	const transitionKeyframes = dataIds.reduce<TKeyFrameSpec[]>(
		(accumulator, currentId, index) => {
			if (index === 0) {
				const nextId = dataIds[index + 1];
				accumulator.push({
					type: 'SECOND',
					value: 0,
					id: `DATA_ENTER_START__${currentId}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 3,
					id: `DATA_ENTER_END__${currentId}`,
					relativeId: `DATA_ENTER_START__${currentId}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 0,
					id: `TRANSITION_START__${currentId}_${nextId}`,
					relativeId: `DATA_ENTER_END__${currentId}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 1,
					id: `TRANSITION_END__${currentId}_${nextId}`,
					relativeId: `TRANSITION_START__${currentId}_${nextId}`,
				});
			} else if (index < dataIds.length - 1) {
				// normal case
				const nextId = dataIds[index + 1];
				accumulator.push({
					type: 'R_SECOND',
					value: 0,
					id: `TRANSITION_START__${currentId}_${nextId}`,
					relativeId: `TRANSITION_END__${dataIds[index - 1]}_${currentId}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 1,
					id: `TRANSITION_END__${currentId}_${nextId}`,
					relativeId: `TRANSITION_START__${currentId}_${nextId}`,
				});
			} else {
				// last case
				const prevId = dataIds[index - 1];
				accumulator.push({
					type: 'R_SECOND',
					value: 0,
					id: `DATA_EXIT_START__${currentId}`,
					relativeId: `TRANSITION_END__${prevId}_${currentId}`,
				});
				accumulator.push({
					type: 'R_SECOND',
					value: 3,
					id: `DATA_EXIT_END__${currentId}`,
					relativeId: `DATA_EXIT_START__${currentId}`,
				});
			}

			return accumulator;
		},
		[]
	);

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		...transitionKeyframes,
	]);

	return keyframes;
}
