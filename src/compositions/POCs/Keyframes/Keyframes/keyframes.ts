import {interpolate, Easing, EasingFunction} from 'remotion';
import invariant from 'tiny-invariant';

// ************************************************************************
// Key Frame Spec
// ************************************************************************
type TKeyFrameSpec_SECOND = {
	type: 'SECOND';
	value: number;
	id: string;
};
type TKeyFrameSpec_FRAME = {
	type: 'FRAME';
	value: number;
	id: string;
};

type TKeyFrameSpec_R_SECOND = {
	type: 'R_SECOND';
	value: number;
	id: string;
	relativeId: string;
};

type TKeyFrameSpec_R_FRAME = {
	type: 'R_FRAME';
	value: number;
	id: string;
	relativeId: string;
};

export type TKeyFrameSpec =
	| TKeyFrameSpec_SECOND
	| TKeyFrameSpec_R_SECOND
	| TKeyFrameSpec_FRAME
	| TKeyFrameSpec_R_FRAME;

// ************************************************************************
// KeyFrames
// ************************************************************************

export type TKeyFrame = {
	id: string;
	frame: number;
	spec: TKeyFrameSpec;
};

export type TKeyFramesGroup = {
	durationInFrames: number;
	fps: number;
	keyFrames: TKeyFrame[];
};

export function getSign(value: number): number {
	if (Object.is(value, -0)) {
		return -1; // Return -1 for -0
	}

	if (Object.is(value, 0)) {
		return 1; // Return +1 for +0
	}

	return Math.sign(value); // Use Math.sign for other numbers
}
// Examples
// console.log(getSign(-0));   // Output: -1
// console.log(getSign(0));    // Output: 1
// console.log(getSign(-5));   // Output: -1
// console.log(getSign(5));    // Output: 1

export function buildKeyFramesGroup(
	durationInFrames: number,
	fps: number,
	keyFrameSpecs: TKeyFrameSpec[]
): TKeyFramesGroup {
	// TODO check id uniqueness, if not unique raise error!

	const keyFrames = keyFrameSpecs.reduce<TKeyFrame[]>((acc, keyFrameSpec) => {
		let keyFrame: number;
		if (keyFrameSpec.type === 'SECOND') {
			if (getSign(keyFrameSpec.value) === 1) {
				keyFrame = Math.floor(keyFrameSpec.value * (fps - 1)); // Convert seconds to frames
			} else {
				keyFrame = durationInFrames - 1 + keyFrameSpec.value * fps;
			}
		} else if (keyFrameSpec.type === 'FRAME') {
			if (getSign(keyFrameSpec.value) === 1) {
				keyFrame = keyFrameSpec.value;
			} else {
				// if the value is negative -0 --> last frame, -1 --> vorletzte frame, etc....
				keyFrame = durationInFrames - 1 + keyFrameSpec.value;
			}
		} else if (keyFrameSpec.type === 'R_FRAME') {
			const relativeKeyFrameObject = acc.find(
				(currentKeyFrame) => currentKeyFrame.id === keyFrameSpec.relativeId
			);
			if (!relativeKeyFrameObject) {
				throw new Error(
					`Unknown relative keyframe id ${keyFrameSpec.relativeId}`
				);
			}
			keyFrame = relativeKeyFrameObject.frame + keyFrameSpec.value;
		} else if (keyFrameSpec.type === 'R_SECOND') {
			const relativeKeyFrameObject = acc.find(
				(currentKeyFrame) => currentKeyFrame.id === keyFrameSpec.relativeId
			);
			if (!relativeKeyFrameObject) {
				throw new Error(
					`Unknown relative keyframe id ${keyFrameSpec.relativeId}`
				);
			}
			keyFrame = relativeKeyFrameObject.frame + keyFrameSpec.value * fps;
		} else {
			throw new Error(`Unknown keyFrame type`);
		}

		// Add the new TSeq to the accumulator
		acc.push({
			id: keyFrameSpec.id,
			frame: keyFrame,
			spec: keyFrameSpec,
		});

		return acc;
	}, []);

	return {durationInFrames, fps, keyFrames};
}

export function getKeyFrame(
	keyFramesGroup: TKeyFramesGroup,
	keyFrameId: string
): TKeyFrame {
	const foundKeyFrame = keyFramesGroup.keyFrames.find(
		(it) => it.id === keyFrameId
	);
	if (!foundKeyFrame) {
		throw Error(`Could not find keyFrame with id: ${keyFrameId}`);
	}

	return foundKeyFrame;
}

export function getKeyFramesInterpolator(
	keyFramesGroup: TKeyFramesGroup,
	keyFrameIds: string[],
	values: number[],
	easings: EasingFunction[] = [Easing.ease, Easing.ease, Easing.bounce]
): (frame: number) => number {
	invariant(keyFrameIds.length === values.length);
	invariant(
		keyFrameIds.length === easings.length + 1,
		`easings are not of supported length. please pass an array of easings with one easing per transition (in this specific case ${
			keyFrameIds.length - 1
		}, while you passed ${easings.length})`
	);

	const keyFrames = keyFrameIds.map((id) => getKeyFrame(keyFramesGroup, id));
	const frames = keyFrames.map((it) => it.frame);

	return (frame) => {
		const currentTransitionIndex = getActiveTransitionIndex(frames, frame);

		const currentStartFrame = frames[currentTransitionIndex];
		const currentEndFrame = frames[currentTransitionIndex + 1];

		const currentStartValue = values[currentTransitionIndex];
		const currentEndValue = values[currentTransitionIndex + 1];

		const currentEasing = easings[currentTransitionIndex];

		return interpolate(
			frame,
			[currentStartFrame, currentEndFrame],
			[currentStartValue, currentEndValue],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
				easing: currentEasing,
			}
		);
	};
}
// e.g.
// const interpolator = getInterpolator(keyFramesGroup, ["START_TITLE", "END_TITLE", "START_EXIT", "END_EXIT"], [0,1,1,0])
function getActiveTransitionIndex(
	keyframes: number[],
	currentFrame: number
): number {
	// If the current frame is smaller than the first keyframe, return 0
	if (currentFrame < keyframes[0]) {
		return 0;
	}

	// If the current frame is larger than the last keyframe, return the last index
	if (currentFrame >= keyframes[keyframes.length - 1]) {
		return keyframes.length - 2; // Last transition's index is length - 2
	}

	// Iterate through the keyframes array
	for (let i = 0; i < keyframes.length - 1; i++) {
		// Check if the current frame is within the range of two consecutive keyframes
		if (currentFrame >= keyframes[i] && currentFrame < keyframes[i + 1]) {
			return i;
		}
	}

	return 0; // Default case, though this should never be reached
}
// // Example usage:
// const keyframes = [0, 100, 200, 500];
// // Test cases
// console.log(getActiveTransitionIndex(keyframes, 220));  // Output: 2
// console.log(getActiveTransitionIndex(keyframes, 100));  // Output: 1
// console.log(getActiveTransitionIndex(keyframes, 50));   // Output: 0 (smaller than first keyframe)
// console.log(getActiveTransitionIndex(keyframes, 600));  // Output: 2 (larger than last keyframe)

export const getExclusiveSequenceDuration = (
	keyframes: TKeyFramesGroup,
	startKeyFrameId: string,
	endKeyFrameId: string
) => {
	// TODO api: keyframesGroup.getKeyFrame("XXXXXXXXXX")
	const keyFrameStart = getKeyFrame(keyframes, startKeyFrameId);
	const keyFrameEnd = getKeyFrame(keyframes, endKeyFrameId);

	const inclusiveDuration = keyFrameEnd.frame - keyFrameStart.frame;

	return inclusiveDuration;
};
