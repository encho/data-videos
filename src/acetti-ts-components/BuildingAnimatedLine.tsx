import {ScaleLinear} from 'd3-scale';
import {line} from 'd3-shape';
import {useCurrentFrame, interpolate, Easing, useVideoConfig} from 'remotion';

import {getXY} from '../acetti-ts-periodsScale/getXY';
import {TPeriodsScale} from '../acetti-ts-periodsScale/periodsScale';
import {TGridLayoutArea} from '../acetti-layout';
import {TimeSeries} from '../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {isNumber} from 'lodash';

export const BuildingAnimatedLine: React.FC<{
	lineColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	displayDots?: boolean;
	fadeInDurationInFrames: number;
	fadeOutDurationInFrames: number;
}> = ({
	lineColor,
	area,
	timeSeries,
	periodsScale,
	yScale,
	displayDots = false,
	fadeInDurationInFrames,
	fadeOutDurationInFrames,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// const percAnimation = interpolate(
	// 	frame,
	// 	[
	// 		0,
	// 		fadeInDurationInFrames,
	// 		durationInFrames - fadeOutDurationInFrames,
	// 		durationInFrames - 1,
	// 	],
	// 	[0, 1, 1, 0],
	// 	{
	// 		easing: Easing.ease,
	// 	}
	// );

	const isFadingOut = frame > durationInFrames - fadeOutDurationInFrames;

	// const percX = interpolate(
	// 	frame,
	// 	[
	// 		0,
	// 		fadeInDurationInFrames,
	// 		durationInFrames - fadeOutDurationInFrames,
	// 		durationInFrames - 1,
	// 	],
	// 	[0, 1, 1, 0],
	// 	{
	// 		easing: Easing.ease,
	// 	}
	// );

	const percX = interpolate(
		frame,
		[
			0,
			fadeInDurationInFrames,
			durationInFrames - fadeOutDurationInFrames,
			durationInFrames - 1,
		],
		[0, 1, 1, 0],
		{
			easing: Easing.ease,
		}
	);

	const fadeOutOpacity = interpolate(
		frame,
		[durationInFrames - fadeOutDurationInFrames, durationInFrames - 1],
		[1, 0],
		{extrapolateLeft: 'clamp', easing: Easing.ease}
	);

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();

	const currentAnchorDomainIndex = percX * visibleDomainIndices[1];

	const {x, y} = getXY({
		periodsScale,
		yScale: yScale,
		timeSeries,
		domainIndex: currentAnchorDomainIndex,
	});

	const {x: lastX, y: lastY} = getXY({
		periodsScale,
		yScale: yScale,
		timeSeries,
		domainIndex: visibleDomainIndices[1],
	});

	// const visibleAreaWidth = x;

	const linePath = line<{date: Date; value: number}>()
		.x((d) => periodsScale.getBandFromDate(d.date).centroid)
		.y((d) => yScale(d.value));

	const d = linePath(timeSeries) || '';

	return (
		<svg
			overflow="visible"
			width={area.width}
			height={area.height}
			opacity={fadeOutOpacity}
		>
			<defs>
				{isFadingOut ? (
					<clipPath id="plotAreaClipPath2">
						<rect x={area.width - x} y={0} width={x} height={area.height} />
					</clipPath>
				) : (
					<clipPath id="plotAreaClipPath2">
						<rect x={0} y={0} width={x} height={area.height} />
					</clipPath>
				)}
			</defs>

			<g clipPath="url(#plotAreaClipPath2)">
				<path d={d} stroke={lineColor} strokeWidth={4} fill="none" />
				{/* dots */}
			</g>
			<g>
				{displayDots
					? timeSeries.map((timeSeriesItem) => {
							const band = periodsScale.getBandFromDate(timeSeriesItem.date);
							const cx = band.centroid;
							const cy = yScale(timeSeriesItem.value);
							return (
								<g>
									<circle cx={cx} cy={cy} r={6} fill={lineColor} opacity={1} />
								</g>
							);
					  })
					: null}
			</g>

			{x && y && lastY && lastX ? (
				<circle
					cx={isFadingOut ? lastX : x}
					cy={isFadingOut ? lastY : y}
					r={11}
					fill={lineColor}
				/>
			) : null}
		</svg>
	);
};

export const AnimatedSparklineStartDot: React.FC<{
	dotColor: string;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	periodsScale: TPeriodsScale;
	yScale: ScaleLinear<number, number>;
	fadeOutDurationInFrames: number;
}> = ({
	dotColor,
	area,
	timeSeries,
	periodsScale,
	yScale,
	fadeOutDurationInFrames,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// const fadeOutOpacity = interpolate(
	// 	frame,
	// 	[durationInFrames - fadeOutDurationInFrames, durationInFrames - 1],
	// 	[1, 0],
	// 	{extrapolateLeft: 'clamp', easing: Easing.ease}
	// );

	// TODO as prop?
	const entryDurationInFrames = fps * 1;

	const radius =
		frame < durationInFrames - fadeOutDurationInFrames
			? interpolate(frame, [0, entryDurationInFrames], [0, 12], {
					easing: Easing.bounce,
					extrapolateRight: 'clamp',
			  })
			: interpolate(
					frame,
					[fadeOutDurationInFrames, durationInFrames - 1],
					[12, 0],
					{
						easing: Easing.elastic(1),
						extrapolateRight: 'clamp',
					}
			  );

	const visibleDomainIndices = periodsScale.getVisibleDomainIndices();
	// const currentRightVisibleDomainIndex =
	// 	percAnimation * visibleDomainIndices[1];

	const {x, y} = getXY({
		periodsScale,
		yScale: yScale,
		timeSeries,
		domainIndex: visibleDomainIndices[0],
	});

	return (
		<svg
			overflow="visible"
			width={area.width}
			height={area.height}
			// opacity={fadeOutOpacity}
		>
			{isNumber(x) && isNumber(y) ? (
				<circle cx={x} cy={y} r={radius} fill={dotColor} />
			) : null}
		</svg>
	);
};
