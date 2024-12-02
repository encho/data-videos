import {ReactNode, useMemo} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import invariant from 'tiny-invariant';

import {
	buildKeyFramesGroup,
	getKeyFrame,
	getKeyFramesInterpolator,
} from '../../Keyframes/Keyframes/keyframes';
import {usePage} from '../../../../acetti-components/PageContext';

export const Platte3D_SlideInAndOut: React.FC<{
	children: ReactNode;
	width: number;
	height: number;
}> = ({children, width, height}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const {theme} = usePage();

	const keyframes = useMemo(
		() =>
			buildKeyFramesGroup(durationInFrames, fps, [
				// the entry...
				{type: 'SECOND', value: 0, id: 'PLATTE_OUTSIDE'},
				{
					type: 'R_SECOND',
					value: 0.3,
					id: 'PLATTE_BACKGROUND_1',
					relativeId: 'PLATTE_OUTSIDE',
				},
				{
					type: 'R_SECOND',
					value: 0.6,
					id: 'PLATTE_FOREGROUND_START',
					relativeId: 'PLATTE_BACKGROUND_1',
				},
				// the exit...
				{
					type: 'SECOND',
					value: -0,
					id: 'PLATTE_EXITED',
				},
				{
					type: 'R_SECOND',
					value: -0.4,
					id: 'PLATTE_BACKGROUND_2',
					relativeId: 'PLATTE_EXITED',
				},
				{
					type: 'R_SECOND',
					value: -0.8,
					id: 'PLATTE_FOREGROUND_END',
					relativeId: 'PLATTE_BACKGROUND_2',
				},
			]),
		[durationInFrames, fps]
	);

	const keyframe_foregroundStart = useMemo(
		() => getKeyFrame(keyframes, 'PLATTE_FOREGROUND_START'),
		[keyframes]
	);

	const keyframe_foregroundEnd = useMemo(
		() => getKeyFrame(keyframes, 'PLATTE_FOREGROUND_END'),
		[keyframes]
	);

	invariant(
		keyframe_foregroundStart.frame < keyframe_foregroundEnd.frame,
		'Platte3D_SlideInAndOut: sequence is too short!'
	);

	const spec = useMemo(
		() => ({
			outside: {
				translateZ: 50,
				rotateY: 2,
				translateX: 2000,
			},
			background_1: {
				translateZ: -200 / 5,
				rotateY: -0.5,
				translateX: 0,
			},
			foreground: {
				translateZ: 0,
				rotateY: 0,
				translateX: 0,
			},
			background_2: {
				translateZ: -200,
				rotateY: -5,
				translateX: 0,
			},
			exited: {
				translateZ: -3000,
				rotateY: -20,
				translateX: -20000,
			},
		}),
		[]
	);

	const getTranslateZ = useMemo(
		() =>
			getKeyFramesInterpolator(
				keyframes,
				[
					'PLATTE_OUTSIDE',
					'PLATTE_BACKGROUND_1',
					'PLATTE_FOREGROUND_START',
					'PLATTE_FOREGROUND_END',
					'PLATTE_BACKGROUND_2',
					'PLATTE_EXITED',
				],
				[
					spec.outside.translateZ,
					spec.background_1.translateZ,
					spec.foreground.translateZ,
					spec.foreground.translateZ,
					spec.background_2.translateZ,
					spec.exited.translateZ,
				],
				[
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.bezier(0.83, 0, 0.17, 1),
				] // easeInOutQuint
			),
		[spec, keyframes]
	);

	const getRotateY = useMemo(
		() =>
			getKeyFramesInterpolator(
				keyframes,
				[
					'PLATTE_OUTSIDE',
					'PLATTE_BACKGROUND_1',
					'PLATTE_FOREGROUND_START',
					'PLATTE_FOREGROUND_END',
					'PLATTE_BACKGROUND_2',
					'PLATTE_EXITED',
				],
				[
					spec.outside.rotateY,
					spec.background_1.rotateY,
					spec.foreground.rotateY,
					spec.foreground.rotateY,
					spec.background_2.rotateY,
					spec.exited.rotateY,
				],
				[
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.bezier(0.83, 0, 0.17, 1),
				] // easeInOutQuint
			),
		[spec, keyframes]
	);

	const getTranslateX = useMemo(
		() =>
			getKeyFramesInterpolator(
				keyframes,
				[
					'PLATTE_OUTSIDE',
					'PLATTE_BACKGROUND_1',
					'PLATTE_FOREGROUND_START',
					'PLATTE_FOREGROUND_END',
					'PLATTE_BACKGROUND_2',
					'PLATTE_EXITED',
				],
				[
					spec.outside.translateX,
					spec.background_1.translateX,
					spec.foreground.translateX,
					spec.foreground.translateX,
					spec.background_2.translateX,
					spec.exited.translateX,
				],
				[
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.ease,
					Easing.bezier(0.83, 0, 0.17, 1),
				] // easeInOutQuint
			),
		[spec, keyframes]
	);

	const translateZ = getTranslateZ(frame);
	const rotateY = getRotateY(frame);
	const translateX = getTranslateX(frame);

	// Define perspective depth
	const perspectiveDepth = 500;

	return (
		<div
			style={{
				width,
				height,
				position: 'relative',
				margin: '0 auto',
				backgroundColor: theme.global.backgroundColor,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: '10px', // TODO from theme
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // TODO from theme
				transformStyle: 'preserve-3d', // Ensures child elements respect 3D perspective
				perspective: `${perspectiveDepth}px`, // Set perspective for parent container
				transform: `perspective(${perspectiveDepth}px) translateY(0px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
			}}
		>
			{children}
		</div>
	);
};
