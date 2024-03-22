import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import invariant from 'tiny-invariant';
import {
	// formatToPercentage,
	findItemById,
	getEnterUpdateExits,
} from './utils';
import {getLabelMappedValue, getLabelValue} from '../acetti-axis/axisSpec';
import {TAxisSpec} from '../acetti-axis/axisSpec';

export const Transition_HorizontalDateAxis_Labels: React.FC<{
	from: TAxisSpec;
	to: TAxisSpec;
	labelColor: string;
	tickSize: number;
	tickLabelMargin: number;
}> = ({
	from: startSpec,
	to: endSpec,
	labelColor,
	tickSize,
	tickLabelMargin,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const animationPercentage = frame / durationInFrames;

	const labelsEnterUpdateExits = getEnterUpdateExits(
		startSpec.labels.map((it) => it.id),
		endSpec.labels.map((it) => it.id)
	);

	const enterLabels = labelsEnterUpdateExits.enter.map((labelId) => {
		const endLabel = findItemById(endSpec.labels, labelId);
		invariant(endLabel);

		const endLabelValue = getLabelValue(endSpec, labelId);

		const startX = startSpec.scale(endLabelValue);
		const endX = getLabelMappedValue(endSpec, labelId);

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
			id: labelId,
			mappedValue: interpolatedX,
			opacity: interpolatedOpacity,
			label: endLabel.label,
			textAnchor: endLabel.textAnchor,
		};
	});

	const updateLabels = labelsEnterUpdateExits.update.map((labelId) => {
		const startLabel = findItemById(startSpec.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(startSpec, labelId);
		const endX = getLabelMappedValue(endSpec, labelId);

		const currentX =
			(1 - animationPercentage) * startX + animationPercentage * endX;

		return {
			id: labelId,
			mappedValue: currentX,
			label: startLabel.label,

			textAnchor: startLabel.textAnchor,
		};
	});

	const exitLabels = labelsEnterUpdateExits.exit.map((labelId) => {
		const startLabel = findItemById(startSpec.labels, labelId);
		invariant(startLabel);

		const startX = getLabelMappedValue(startSpec, labelId);

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
			id: labelId,
			mappedValue: startX,
			opacity: interpolatedOpacity,
			label: startLabel.label,
			textAnchor: startLabel.textAnchor,
		};
	});

	return (
		<g>
			{/* enter labels  */}
			{enterLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor={it.textAnchor || 'start'}
							alignmentBaseline="hanging"
							fill={labelColor}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={tickSize + tickLabelMargin}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* update labels  */}
			{updateLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={labelColor}
							stroke={labelColor}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={tickSize + tickLabelMargin}
						>
							{it.label}
						</text>
					</g>
				);
			})}

			{/* exit labels  */}
			{exitLabels.map((it, i) => {
				return (
					<g key={i}>
						<text
							textAnchor="middle"
							alignmentBaseline="hanging"
							fill={labelColor}
							// fontFamily={fontFamilyXTicklabels}
							// fontSize={styling.xTickValuesFontSize}
							fontSize={16}
							x={it.mappedValue}
							y={tickSize + tickLabelMargin}
							opacity={it.opacity}
						>
							{it.label}
						</text>
					</g>
				);
			})}
		</g>
	);
};
