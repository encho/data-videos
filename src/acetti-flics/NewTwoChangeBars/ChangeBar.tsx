import {line, curveLinearClosed} from 'd3-shape';
import {
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {FadeInAndOutText} from '../../compositions/SimpleStats/FadeInAndOutText';
import {TGridLayoutArea, Area, HtmlArea} from '../../acetti-layout';

// TODO implement and put into layout lib
// const getSpannedArea

// TODO put into layout lib
const getRelativeArea = (
	childArea: TGridLayoutArea,
	parentArea: TGridLayoutArea
): TGridLayoutArea => {
	const relativeArea = {
		x1: childArea.x1 - parentArea.x1,
		x2: childArea.x2 - parentArea.x1,
		y1: childArea.y1 - parentArea.y1,
		y2: childArea.y2 - parentArea.y1,
	};

	return {
		...relativeArea,
		width: relativeArea.x2 - relativeArea.x1,
		height: relativeArea.y2 - relativeArea.y1,
	};
};

// TODO actually this is a single Bar animation! that spans the whole area!!
// TODO rename to SingleBarAnimation
export const ChangeBar: React.FC<{
	// from: number;
	// durationInFrames: number;
	areas: {
		bar: TGridLayoutArea;
		valueLabel: TGridLayoutArea;
		label: TGridLayoutArea;
	};
	value: number;
	label: string;
	visibleDomain: [number, number];
	valueFormatter: (x: number) => string;
	isTrimmed: boolean;
	backgroundColor: string;
	barColor: string;
	labelColor: string;
	valueTextColor: string;
}> = ({
	// from,
	// durationInFrames,
	areas,
	value,
	visibleDomain,
	label,
	valueFormatter,
	isTrimmed,
	backgroundColor,
	barColor,
	labelColor,
	valueTextColor,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const ANIMATION_SPECS = {
		bar: {
			from: 90 * 1,
			durationInFrames: durationInFrames - 90 * 1.75, // auto-determine from total sequence duration
			enterDurationInFrames: 90 * 1,
			exitDurationInFrames: 90 * 0.5,
		},
		label: {
			from: 0,
			durationInFrames, // auto-determine from total sequence duration
		},
	};

	const totalBarArea = {
		x1: areas.valueLabel.x1,
		x2: areas.valueLabel.x2,
		width: areas.valueLabel.x2 - areas.valueLabel.x1,
		y1: areas.valueLabel.y1,
		y2: areas.label.y2,
		height: areas.label.y2 - areas.valueLabel.y1,
	};

	const valueLabelArea = getRelativeArea(areas.valueLabel, totalBarArea);
	const barArea = getRelativeArea(areas.bar, totalBarArea);
	const labelArea = getRelativeArea(areas.label, totalBarArea);

	return (
		<div
			style={{
				width: totalBarArea.width,
				height: totalBarArea.height,
				position: 'absolute',
				top: areas.valueLabel.y1,
				left: areas.valueLabel.x1,
			}}
		>
			{/* PercChange Display */}

			{/* Bar with ValueLabel */}
			<svg
				style={{
					width: areas.valueLabel.x2 - areas.valueLabel.x1,
					height: areas.label.y2 - areas.valueLabel.y1,
					overflow: 'visible',
				}}
			>
				<Sequence
					name="Bar"
					layout="none"
					from={ANIMATION_SPECS.bar.from}
					durationInFrames={ANIMATION_SPECS.bar.durationInFrames}
				>
					<Area area={barArea}>
						<AnimatedSvgBar
							value={value}
							visibleDomain={visibleDomain}
							area={barArea}
							valueLabelArea={valueLabelArea}
							valueFormatter={valueFormatter}
							enterDurationInFrames={ANIMATION_SPECS.bar.enterDurationInFrames}
							exitDurationInFrames={ANIMATION_SPECS.bar.exitDurationInFrames}
							isTrimmed={isTrimmed}
							backgroundColor={backgroundColor}
							barColor={barColor}
							valueTextColor={valueTextColor}
						/>
						<g></g>
					</Area>
				</Sequence>
			</svg>
			{/* Label */}
			<Sequence
				name="LabelDiv"
				layout="none"
				from={ANIMATION_SPECS.label.from}
				durationInFrames={ANIMATION_SPECS.label.durationInFrames}
			>
				<HtmlArea area={labelArea}>
					<div
						style={{
							color: labelColor,
							fontSize: labelArea.height,
							fontWeight: 600,
							fontFamily: 'Arial',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<FadeInAndOutText>{label}</FadeInAndOutText>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};

const AnimatedSvgBar = ({
	value,
	valueFormatter,
	visibleDomain,
	area,
	valueLabelArea,
	enterDurationInFrames,
	exitDurationInFrames,
	isTrimmed,
	backgroundColor,
	barColor,
	valueTextColor,
}: {
	value: number;
	visibleDomain: [number, number];
	valueFormatter: (x: number) => string;
	// barScale: ScaleLinear<number, number>;
	area: TGridLayoutArea;
	valueLabelArea: TGridLayoutArea;
	//TODO enter and exits should be fixtures
	enterDurationInFrames: number;
	exitDurationInFrames: number;
	isTrimmed: boolean;
	backgroundColor: string;
	barColor: string;
	valueTextColor: string;
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const interpolateEnterOpacity = (f: number) => {
		const barOpacity = interpolate(frame, [0, enterDurationInFrames], [0, 1], {
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

		return barOpacity;
	};

	const interpolateExitOpacity = (f: number) => {
		const barOpacity = interpolate(
			frame,
			[durationInFrames - exitDurationInFrames, durationInFrames],
			[1, 0.85],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return barOpacity;
	};

	const barHeightScale: ScaleLinear<number, number> = scaleLinear()
		.domain(visibleDomain)
		.range([0, area.height]);

	const fullBarHeight = barHeightScale(value);

	const interpolateEnterBarHeight = (f: number) => {
		const barHeight = interpolate(
			frame,
			[0, enterDurationInFrames],
			[0, fullBarHeight],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return barHeight;
	};

	const interpolateExitBarHeight = (f: number) => {
		const barHeight = interpolate(
			frame,
			[durationInFrames - exitDurationInFrames, durationInFrames],
			[fullBarHeight, 0],
			{
				easing: Easing.cubic,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);

		return barHeight;
	};

	const opacity =
		frame < durationInFrames - exitDurationInFrames
			? interpolateEnterOpacity(frame)
			: interpolateExitOpacity(frame);

	const barHeight =
		frame < durationInFrames - exitDurationInFrames
			? interpolateEnterBarHeight(frame)
			: interpolateExitBarHeight(frame);

	const barCompletionPercentage = barHeight / area.height;

	const currentBarValue =
		visibleDomain[0] +
		(visibleDomain[1] - visibleDomain[0]) * barCompletionPercentage;

	const shiftDownValueLabelBy = area.height - barHeight;

	const trimmerSteigungInPixels = 40;
	const trimmerLeftAnsatz = Math.min(0 + 60, barHeight - 80);
	const trimmerLeftCentroidY = area.height - trimmerLeftAnsatz;
	const trimmerRightCentroidY = trimmerLeftCentroidY - trimmerSteigungInPixels;

	const trimmerHeight = 10;

	const trimmerPoints = [
		{x: 0 - 5, y: trimmerLeftCentroidY + trimmerHeight / 2},
		{x: 0 - 5, y: trimmerLeftCentroidY - trimmerHeight / 2},
		{x: area.width + 5, y: trimmerRightCentroidY - trimmerHeight / 2},
		{x: area.width + 5, y: trimmerRightCentroidY + trimmerHeight / 2},
	];

	// Create a line generator with closed path
	const lineGenerator = line<{x: number; y: number}>()
		.x((d) => d.x)
		.y((d) => d.y)
		.curve(curveLinearClosed); // This ensures the path will close

	// Generate the path data
	const pathData = lineGenerator(trimmerPoints) || '';

	const pathColor = backgroundColor;

	return (
		<g>
			<mask id="barAreaMask">
				<rect
					y={0}
					x={-5}
					height={area.height}
					width={area.width + 10}
					rx={3}
					ry={3}
					fill="white"
				/>
			</mask>

			<rect
				opacity={opacity}
				y={area.height - barHeight}
				x={0}
				height={barHeight}
				width={area.width}
				fill={barColor}
				rx={3}
				ry={3}
			/>

			{isTrimmed ? (
				<g mask="url(#barAreaMask)">
					<g transform={`translate(${0}, ${0})`}>
						<path d={pathData} fill={pathColor} />
					</g>
				</g>
			) : null}

			<g transform={`translate(0,${shiftDownValueLabelBy})`}>
				<foreignObject
					width={valueLabelArea.width}
					height={valueLabelArea.height}
					y={0 - area.y1 - valueLabelArea.y1}
					x={0}
				>
					<div
						style={{
							width: valueLabelArea.width,
							height: valueLabelArea.height,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								color: valueTextColor,
								fontSize: valueLabelArea.height,
								fontWeight: 500,
								fontFamily: 'Arial',
							}}
						>
							<FadeInAndOutText>
								{valueFormatter(currentBarValue)}
							</FadeInAndOutText>
						</div>
					</div>
				</foreignObject>
			</g>
		</g>
	);
};
