import {
	useVideoConfig,
	useCurrentFrame,
	spring,
	Sequence,
	interpolate,
	// Easing,
	// useVideoConfig
} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {evolvePath} from '@remotion/paths';
import {Triangle} from '@remotion/shapes';

import {FadeInAndOutText} from '../../compositions/SimpleStats/FadeInAndOutText';
import {TGridLayoutArea} from '../../acetti-layout';

type ArrowTypeSequenceType = {
	areas: {
		percChangeDisplay: TGridLayoutArea;
		firstBar: TGridLayoutArea;
		secondBar: TGridLayoutArea;
	};
	visibleDomain: [number, number];
	rightBarValue: number;
	leftBarValue: number;
	strokeWidth: number;
	color: string;
	percentageChangeText: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: number;
};

// rename to AnimatedArrowPath or so
export const AnimatedArrowPath: React.FC<ArrowTypeSequenceType> = ({
	areas,
	visibleDomain,
	rightBarValue,
	leftBarValue,
	color,
	strokeWidth,
	percentageChangeText,
	fontSize,
	fontFamily,
	fontWeight,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// calculate path animation infos
	// ********************
	const pathAnimationDelay = 0; // TODO deprecate
	const pathLineAnimationDuration = 90 * 1;
	const pathTriangleAnimationDuration = 90 * 0.3;

	const globalTriangleAnimationDelay =
		pathAnimationDelay + pathLineAnimationDuration;

	const pathSpring = spring({
		fps,
		frame,
		config: {damping: 50, stiffness: 500},
		durationInFrames: pathLineAnimationDuration,
		delay: pathAnimationDelay,
	});

	const triangleOpacitySpring = interpolate(
		frame,
		[
			globalTriangleAnimationDelay,
			globalTriangleAnimationDelay + pathTriangleAnimationDuration,
		],
		[0, 1],
		{
			// easing: Easing.cubic,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// calculate path points
	// ********************
	const getCurrentLeftBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(visibleDomain)
		.range([0, areas.firstBar.height]);

	const finalLeftBarHeight = getCurrentLeftBarHeight(leftBarValue);

	const getCurrentRightBarHeight: ScaleLinear<number, number> = scaleLinear()
		.domain(visibleDomain)
		.range([0, areas.firstBar.height]);

	const finalRightBarHeight = getCurrentRightBarHeight(rightBarValue);

	const firstBarCenterX = (areas.firstBar.x1 + areas.firstBar.x2) / 2;

	const secondBarCenterX = (areas.secondBar.x1 + areas.secondBar.x2) / 2;

	const leftBarPathEndY =
		areas.percChangeDisplay.height + areas.firstBar.height - finalLeftBarHeight;

	const rightBarPathEndY =
		areas.percChangeDisplay.height +
		areas.firstBar.height -
		finalRightBarHeight -
		24; // for arrow...

	const H = 20;
	const topPathYLevel = Math.min(leftBarPathEndY, rightBarPathEndY) - H;

	const pathPoints: Point[] = [
		{x: firstBarCenterX, y: leftBarPathEndY},
		{x: firstBarCenterX, y: topPathYLevel},
		{x: secondBarCenterX, y: topPathYLevel},
		{
			x: secondBarCenterX,
			y: rightBarPathEndY,
		},
	];

	const pathData = createPathWithTwoRoundedCorners(
		pathPoints[0],
		pathPoints[1],
		pathPoints[2],
		pathPoints[3],
		5
	);

	const pathEvolution = evolvePath(pathSpring, pathData);
	const pathStrokeWidth = strokeWidth;

	return (
		<div
			style={{
				position: 'absolute',
				top: areas.percChangeDisplay.y1,
				left: areas.percChangeDisplay.x1,
				width: areas.percChangeDisplay.width,
			}}
		>
			<Sequence>
				<div
					style={{
						position: 'absolute',
						top: topPathYLevel,
						marginTop: -fontSize - 10, // the utilized fontsize below with some margin
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							marginTop: `${-0.3}em`, // TODO utilize capsize metrics for given font
							marginBottom: `${-0.32}em`, // TODO utilize capsize metrics for given font
							fontSize,
							color: color,
							fontWeight,
							fontFamily,
						}}
					>
						<FadeInAndOutText>{percentageChangeText}</FadeInAndOutText>
					</div>
				</div>
			</Sequence>

			<svg
				style={{
					width: areas.percChangeDisplay.width,
					height: areas.percChangeDisplay.height,
					overflow: 'visible',
				}}
			>
				<path
					d={pathData}
					strokeDasharray={pathEvolution.strokeDasharray}
					strokeDashoffset={pathEvolution.strokeDashoffset}
					stroke={color}
					fill="none"
					strokeWidth={pathStrokeWidth}
				/>

				<g
					transform={`translate(${
						-24 / 2 + secondBarCenterX
					},${rightBarPathEndY})`}
					opacity={triangleOpacitySpring}
				>
					<Triangle
						length={24}
						fill={color}
						direction="down"
						cornerRadius={6}
					/>
				</g>

				<g></g>
			</svg>
		</div>
	);
};

interface Point {
	x: number;
	y: number;
}

function createPathWithTwoRoundedCorners(
	p1: Point,
	p2: Point,
	p3: Point,
	p4: Point,
	cornerRadius: number
): string {
	// Helper function to calculate tangent points for rounding
	function getTangentPoints(
		p1: Point,
		p2: Point,
		p3: Point,
		radius: number
	): {t1x: number; t1y: number; t2x: number; t2y: number} {
		const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
		const d2 = Math.hypot(p3.x - p2.x, p3.y - p2.y);

		const maxRadius = Math.min(d1, d2) / 2;
		const r = Math.min(radius, maxRadius);

		const t1x = p2.x - (r / d1) * (p2.x - p1.x);
		const t1y = p2.y - (r / d1) * (p2.y - p1.y);
		const t2x = p2.x + (r / d2) * (p3.x - p2.x);
		const t2y = p2.y + (r / d2) * (p3.y - p2.y);

		return {t1x, t1y, t2x, t2y};
	}

	// Calculate tangent points for the corner at p2
	const p2Tangents = getTangentPoints(p1, p2, p3, cornerRadius);

	// Calculate tangent points for the corner at p3
	const p3Tangents = getTangentPoints(p2, p3, p4, cornerRadius);

	// Build the SVG path string
	return `
    M ${p1.x} ${p1.y} 
    L ${p2Tangents.t1x} ${p2Tangents.t1y} 
    Q ${p2.x} ${p2.y} ${p2Tangents.t2x} ${p2Tangents.t2y}
    L ${p3Tangents.t1x} ${p3Tangents.t1y} 
    Q ${p3.x} ${p3.y} ${p3Tangents.t2x} ${p3Tangents.t2y}
    L ${p4.x} ${p4.y}
  `;
}