import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import invariant from 'tiny-invariant';
import {findItemById, getEnterUpdateExits} from './utils';
import {getTickMappedValue, getTickValue} from '../acetti-axis/axisSpec';
import {TAxisSpec} from '../acetti-axis/axisSpec';

export const Transition_HorizontalDateAxis_Ticks: React.FC<{
	from: TAxisSpec;
	to: TAxisSpec;
	tickColor: string;
	tickSize: number;
}> = ({from: startSpec, to: endSpec, tickColor, tickSize}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	const ticksEnterUpdateExits = getEnterUpdateExits(
		startSpec.ticks.map((it) => it.id),
		endSpec.ticks.map((it) => it.id)
	);

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startX = getTickMappedValue(startSpec, tickId);
		const endX = getTickMappedValue(endSpec, tickId);
		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;
		return {id: tickId, mappedValue: currentX};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		const endTick = findItemById(endSpec.ticks, tickId);
		invariant(endTick);

		const startX = startSpec.scale(getTickValue(endSpec, tickId));
		const endX = getTickMappedValue(endSpec, tickId);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
				easing: Easing.linear,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			mappedValue: interpolatedX,
			opacity: interpolatedOpacity,
		};
	});

	const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
		const startTick = findItemById(startSpec.ticks, tickId);
		invariant(startTick);

		const startX = startSpec.scale(startTick.value);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 0.8],
			[1, 0],
			{
				easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			mappedValue: startX,
			opacity: interpolatedOpacity,
		};
	});

	return (
		<g>
			{/* enter ticks  */}
			{enterTicks.map((it, i) => {
				return (
					<g key={i}>
						<line
							x1={it.mappedValue}
							x2={it.mappedValue}
							y1={0}
							y2={tickSize}
							stroke={tickColor}
							strokeWidth={4}
							opacity={it.opacity}
						/>
					</g>
				);
			})}
			{/* update ticks  */}
			{updateTicks.map((it, i) => {
				return (
					<g key={i}>
						<line
							x1={it.mappedValue}
							x2={it.mappedValue}
							y1={0}
							y2={tickSize}
							stroke={tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{/* exit ticks  */}
			{exitTicks.map((it, i) => {
				return (
					<g key={i}>
						<line
							x1={it.mappedValue}
							x2={it.mappedValue}
							y1={0}
							y2={tickSize}
							stroke={tickColor}
							strokeWidth={4}
							opacity={it.opacity}
						/>
					</g>
				);
			})}
		</g>
	);
};
