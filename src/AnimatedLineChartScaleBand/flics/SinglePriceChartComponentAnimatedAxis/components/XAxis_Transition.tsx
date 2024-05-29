import {
	// useCurrentFrame,
	// useVideoConfig,
	interpolate,
} from 'remotion';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-viz';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {getEnterUpdateExits} from '../../../utils/utils';

import {TXAxisSpec} from './axisSpecs';
import {TPeriodsScale} from '../../../periodsScale/periodsScale';

type TTheme_XAxis = ThemeType['xAxis'];

const getTickValue = (axisSpec: TXAxisSpec, tickId: string) => {
	const tickObj = axisSpec.ticks.find((item) => item.id === tickId);
	invariant(tickObj);
	return tickObj.value;
};

export const XAxis_Transition: React.FC<{
	area: TGridLayoutArea;
	fromAxisSpec: TXAxisSpec;
	toAxisSpec: TXAxisSpec;
	theme: TTheme_XAxis;
	easingPercentage: number;
	periodsScale: TPeriodsScale;
}> = ({
	area,
	theme,
	fromAxisSpec,
	toAxisSpec,
	easingPercentage,
	periodsScale,
}) => {
	const TICK_LINE_SIZE = 24;
	const TICK_TEXT_FONT_SIZE = 24;
	const TICK_TEXT_FONT_WEIGHT = 500;

	// const frame = useCurrentFrame();
	// const {durationInFrames} = useVideoConfig();
	// const animationPercentage = frame / durationInFrames;
	const animationPercentage = easingPercentage;

	const ticksEnterUpdateExits = getEnterUpdateExits(
		fromAxisSpec.ticks.map((it) => it.id),
		toAxisSpec.ticks.map((it) => it.id)
	);

	// update ticks positions in time
	const updateTicks = ticksEnterUpdateExits.update.map((tickId) => {
		const startX = getTickValue(fromAxisSpec, tickId);
		const endX = getTickValue(toAxisSpec, tickId);
		// const startX = fromAxisSpec.ticks
		// const currentX =
		// 	(1 - animationPercentage) * startX + animationPercentage * endX;

		const currentX = interpolate(animationPercentage, [0, 1], [startX, endX], {
			// easing: Easing.linear,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

		return {id: tickId, value: currentX};
	});

	const enterTicks = ticksEnterUpdateExits.enter.map((tickId) => {
		// const endTick = findItemById(endSpec.ticks, tickId);
		// invariant(endTick);

		// const startX = startSpec.scale(getTickValue(endSpec, tickId));
		const startX = 0; // QUICK-FIX utilise the right scale...
		const endX = getTickValue(toAxisSpec, tickId);

		const interpolatedX = interpolate(
			animationPercentage,
			[0, 1],
			[startX, endX],
			{
				// easing: Easing.linear,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		const interpolatedOpacity = interpolate(
			animationPercentage,
			[0, 1],
			[0, 1],
			{
				// easing: Easing.bezier(0.25, 1, 0.5, 1),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return {
			id: tickId,
			value: interpolatedX,
			// mappedValue: interpolatedX,
			opacity: interpolatedOpacity,
		};
	});

	// TODO integrate
	// const exitTicks = ticksEnterUpdateExits.exit.map((tickId) => {
	// 	const startTick = findItemById(startSpec.ticks, tickId);
	// 	invariant(startTick);
	// 	const startX = startSpec.scale(startTick.value);
	// 	const interpolatedOpacity = interpolate(
	// 		animationPercentage,
	// 		[0, 0.8],
	// 		[1, 0],
	// 		{
	// 			easing: Easing.bezier(0.25, 1, 0.5, 1),
	// 			extrapolateLeft: 'clamp',
	// 			extrapolateRight: 'clamp',
	// 		}
	// 	);
	// 	return {
	// 		id: tickId,
	// 		mappedValue: startX,
	// 		opacity: interpolatedOpacity,
	// 	};
	// });

	console.log({updateTicks, enterTicks});

	return (
		<svg
			width={area.width}
			height={area.height}
			style={{
				overflow: 'visible',
			}}
		>
			<defs>
				<clipPath id="xAxisAreaClipPath">
					<rect x={0} y={0} width={area.width} height={area.height} />
				</clipPath>
			</defs>

			{/* enter ticks  */}
			{enterTicks.map((it, i) => {
				return (
					<g
						key={i}
						clipPath="url(#xAxisAreaClipPath)"
						transform="translate(0,40)"
					>
						{/* <g key={i}> */}
						<line
							x1={it.value}
							x2={it.value}
							y1={0}
							y2={10}
							stroke={'green'}
							strokeWidth={8}
							opacity={it.opacity}
						/>
					</g>
				);
			})}

			{updateTicks.map((xTick) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,40)">
						<line
							x1={xTick.value}
							x2={xTick.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={8}
						/>
					</g>
				);
			})}

			{fromAxisSpec.ticks.map((xTick) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<line
							x1={xTick.value}
							x2={xTick.value}
							y1={0}
							y2={TICK_LINE_SIZE}
							stroke={theme.tickColor}
							strokeWidth={4}
						/>
					</g>
				);
			})}

			{fromAxisSpec.labels.map((xLabel) => {
				return (
					<g clipPath="url(#xAxisAreaClipPath)" transform="translate(0,0)">
						<text
							textAnchor="left"
							alignmentBaseline="baseline"
							fill={theme.color}
							fontSize={TICK_TEXT_FONT_SIZE}
							fontWeight={TICK_TEXT_FONT_WEIGHT}
							x={xLabel.value}
							y={TICK_TEXT_FONT_SIZE}
						>
							{xLabel.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
