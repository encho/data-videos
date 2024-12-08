import {ReactNode, useMemo, useCallback} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';

import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
} from '../../Keyframes/Keyframes/keyframes';

export const BringForwardCenterTile: React.FC<{
	leftTile: () => ReactNode;
	rightTile: () => ReactNode;
	centerTile: () => ReactNode;
}> = ({leftTile, rightTile, centerTile}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = useMemo(
		() =>
			buildKeyFramesGroup(durationInFrames, fps, [
				{type: 'SECOND', value: 0, id: 'CENTER_PLATTE_ZOOMED'},
				{
					type: 'R_SECOND',
					value: 2,
					id: 'CENTER_PLATTE_UNZOOM_START',
					relativeId: 'CENTER_PLATTE_ZOOMED',
				},
				{
					type: 'R_SECOND',
					value: 0.35,
					id: 'CENTER_PLATTE_UNZOOM_END',
					relativeId: 'CENTER_PLATTE_UNZOOM_START',
				},
				{
					type: 'SECOND',
					value: -0,
					id: 'PLATTEN_EXIT_END',
				},
				{
					type: 'R_SECOND',
					value: -1,
					id: 'PLATTEN_EXIT_START',
					relativeId: 'PLATTEN_EXIT_END',
				},
			]),
		[durationInFrames, fps]
	);

	const tileSpecs = useMemo(
		() => ({
			centerTile: {
				zoomed: {
					translateZ: -180,
					rotateY: 0,
					translateX: 0,
				},
				unzoomed: {
					translateZ: -500,
					rotateY: 0,
					translateX: 0,
				},
				exited: {
					translateZ: 500,
					rotateY: 0,
					translateX: 0,
				},
			},
			leftTile: {
				zoomed: {
					translateZ: -500,
					rotateY: 0,
					translateX: 0,
				},
				unzoomed: {
					translateZ: -500,
					rotateY: 0,
					translateX: 0,
				},
				exited: {
					translateZ: 300,
					rotateY: -10,
					translateX: 0,
				},
			},
			rightTile: {
				zoomed: {
					translateZ: -500,
					rotateY: 0,
					translateX: 0,
				},
				unzoomed: {
					translateZ: -500,
					rotateY: 0,
					translateX: 0,
				},
				exited: {
					translateZ: 300,
					rotateY: 10,
					translateX: 0,
				},
			},
		}),
		[]
	);

	const getInterpolator_translateZ = useCallback(
		(tileSpec: {
			zoomed: {translateZ: number};
			unzoomed: {translateZ: number};
			exited: {translateZ: number};
		}) => {
			return getKeyFramesInterpolator(
				keyframes,
				[
					'CENTER_PLATTE_ZOOMED',
					'CENTER_PLATTE_UNZOOM_START',
					'CENTER_PLATTE_UNZOOM_END',
					'PLATTEN_EXIT_START',
					'PLATTEN_EXIT_END',
				],
				[
					tileSpec.zoomed.translateZ,
					tileSpec.zoomed.translateZ,
					tileSpec.unzoomed.translateZ,
					tileSpec.unzoomed.translateZ,
					tileSpec.exited.translateZ,
				],
				[Easing.ease, Easing.ease, Easing.ease, Easing.ease]
			);
		},
		[keyframes]
	);

	const getInterpolator_rotateY = useCallback(
		(tileSpec: {
			zoomed: {rotateY: number};
			unzoomed: {rotateY: number};
			exited: {rotateY: number};
		}) => {
			return getKeyFramesInterpolator(
				keyframes,
				[
					'CENTER_PLATTE_ZOOMED',
					'CENTER_PLATTE_UNZOOM_START',
					'CENTER_PLATTE_UNZOOM_END',
					'PLATTEN_EXIT_START',
					'PLATTEN_EXIT_END',
				],
				[
					tileSpec.zoomed.rotateY,
					tileSpec.zoomed.rotateY,
					tileSpec.unzoomed.rotateY,
					tileSpec.unzoomed.rotateY,
					tileSpec.exited.rotateY,
				],
				[Easing.ease, Easing.ease, Easing.ease, Easing.ease]
			);
		},
		[keyframes]
	);

	const getInterpolator_translateX = useCallback(
		(tileSpec: {
			zoomed: {translateX: number};
			unzoomed: {translateX: number};
			exited: {translateX: number};
		}) => {
			return getKeyFramesInterpolator(
				keyframes,
				[
					'CENTER_PLATTE_ZOOMED',
					'CENTER_PLATTE_UNZOOM_START',
					'CENTER_PLATTE_UNZOOM_END',
					'PLATTEN_EXIT_START',
					'PLATTEN_EXIT_END',
				],
				[
					tileSpec.zoomed.translateX,
					tileSpec.zoomed.translateX,
					tileSpec.unzoomed.translateX,
					tileSpec.unzoomed.translateX,
					tileSpec.exited.translateX,
				],
				[Easing.ease, Easing.ease, Easing.ease, Easing.ease]
			);
		},
		[keyframes]
	);

	const centerTile_translateZ = getInterpolator_translateZ(
		tileSpecs.centerTile
	)(frame);
	const centerTile_rotateY = getInterpolator_rotateY(tileSpecs.centerTile)(
		frame
	);
	const centerTile_translateX = getInterpolator_translateX(
		tileSpecs.centerTile
	)(frame);

	const leftTile_translateZ = getInterpolator_translateZ(tileSpecs.leftTile)(
		frame
	);
	const leftTile_rotateY = getInterpolator_rotateY(tileSpecs.leftTile)(frame);
	const leftTile_translateX = getInterpolator_translateX(tileSpecs.leftTile)(
		frame
	);

	const rightTile_translateZ = getInterpolator_translateZ(tileSpecs.rightTile)(
		frame
	);
	const rightTile_rotateY = getInterpolator_rotateY(tileSpecs.rightTile)(frame);
	const rightTile_translateX = getInterpolator_translateX(tileSpecs.rightTile)(
		frame
	);

	// Define perspective depth
	const perspectiveDepth = 350;

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				gap: 100,
				perspective: `${perspectiveDepth}px`,
				transformStyle: 'preserve-3d', // Ensures child elements respect 3d perspective
			}}
		>
			<div
				style={{
					transform: `translateY(0px) translateX(${leftTile_translateX}px) translateZ(${leftTile_translateZ}px) rotateY(${leftTile_rotateY}deg)`,
				}}
			>
				{leftTile()}
			</div>
			<div
				style={{
					transform: `translateY(0px) translateX(${centerTile_translateX}px) translateZ(${centerTile_translateZ}px) rotateY(${centerTile_rotateY}deg)`,
				}}
			>
				{centerTile()}
			</div>
			<div
				style={{
					transform: `translateY(0px) translateX(${rightTile_translateX}px) translateZ(${rightTile_translateZ}px) rotateY(${rightTile_rotateY}deg)`,
				}}
			>
				{rightTile()}
			</div>
		</div>
	);
};
