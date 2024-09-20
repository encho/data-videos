// import {line, curveLinearClosed} from 'd3-shape';
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
	barScale: ScaleLinear<number, number>;
	valueFormatter: (x: number) => string;
	isTrimmed: boolean;
}> = ({
	// from,
	// durationInFrames,
	areas,
	value,
	visibleDomain,
	label,
	barScale,
	valueFormatter,
	isTrimmed,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const ANIMATION_SPECS = {
		bar: {
			from: 90 * 1,
			durationInFrames: durationInFrames - 90 * 1, // auto-determine from total sequence duration
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
				// opacity: 0.5,
			}}
		>
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
							valueFormatter={valueFormatter}
							enterDurationInFrames={ANIMATION_SPECS.bar.enterDurationInFrames}
							exitDurationInFrames={ANIMATION_SPECS.bar.exitDurationInFrames}
						/>
						<g></g>
					</Area>
				</Sequence>

				{/* <Sequence
						name="Label"
						layout="none"
						from={ANIMATION_SPECS.label.from}
						durationInFrames={ANIMATION_SPECS.label.durationInFrames}
					>
						<Area area={labelArea}>
							<AnimatedSvgLabel
								fontSize={labelArea.height}
								areaWidth={labelArea.width}
								areaHeight={labelArea.height}
							>
								{label}
							</AnimatedSvgLabel>
							<g></g>
						</Area>
					</Sequence> */}

				{/* TODO these two into the isolated bar component within this file */}
				{/* <mask id="barMask">
					<rect
						y={0}
						x={0}
						height={height}
						width={width}
						rx={3}
						ry={3}
						fill="white"
					/>
				</mask> */}

				{/* <rect
					y={height - currentBarHeightInPixels}
					x={0}
					height={currentBarHeightInPixels}
					width={width}
					fill={barColor}
					rx={3}
					ry={3}
				/> */}
			</svg>
			<Sequence
				name="LabelDiv"
				layout="none"
				from={ANIMATION_SPECS.label.from}
				durationInFrames={ANIMATION_SPECS.label.durationInFrames}
			>
				<HtmlArea area={labelArea}>
					<div
						style={{
							color: 'white',
							fontSize: 40,
							fontWeight: 600,
							fontFamily: 'Arial',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<FadeInAndOutText>hello</FadeInAndOutText>
					</div>
				</HtmlArea>
			</Sequence>
		</div>
	);
};

// TODO AnimatedSVGText...
const AnimatedSvgLabel = ({
	fontSize,
	areaWidth,
	areaHeight,
	children,
}: {
	fontSize: number;
	areaWidth: number;
	areaHeight: number;
	children: string;
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const TEXT_ENTER_DURATION_IN_FRAMES = fps * 0.8;
	const TEXT_EXIT_DURATION_IN_FRAMES = fps * 0.8;

	const opacity = interpolate(
		frame,
		[
			0,
			TEXT_ENTER_DURATION_IN_FRAMES,
			durationInFrames - TEXT_EXIT_DURATION_IN_FRAMES,
			durationInFrames,
		],
		[0, 1, 1, 0],
		{
			easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<g>
			<text
				opacity={opacity}
				x={areaWidth / 2}
				y={areaHeight / 2}
				text-anchor="middle"
				dominant-baseline="middle"
				// dy={'0.06em'}
				fill={'white'}
				fontSize={fontSize}
				fontFamily={'Arial'}
				fontWeight={600}
			>
				{children}
			</text>
		</g>
	);
};

const AnimatedSvgBar = ({
	value,
	valueFormatter,
	visibleDomain,
	area,
	enterDurationInFrames,
	exitDurationInFrames,
}: {
	value: number;
	visibleDomain: [number, number];
	valueFormatter: (x: number) => string;
	// barScale: ScaleLinear<number, number>;
	area: TGridLayoutArea;
	enterDurationInFrames: number;
	exitDurationInFrames: number;
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
			[1, 0],
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

	return (
		<g>
			<rect
				opacity={opacity}
				y={area.height - barHeight}
				x={0}
				height={barHeight}
				width={area.width}
				fill={'cyan'}
				rx={3}
				ry={3}
			/>

			<text
				opacity={opacity}
				x={area.width / 2}
				y={area.height - barHeight - 20}
				text-anchor="middle"
				dominant-baseline="middle"
				dy={'0.06em'}
				fill={'yellow'}
				fontSize={30}
				fontFamily={'Arial'}
				fontWeight={500}
			>
				{valueFormatter(value)}
			</text>
		</g>
	);
};
