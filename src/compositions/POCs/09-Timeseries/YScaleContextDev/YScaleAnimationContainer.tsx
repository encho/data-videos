import {Sequence, useCurrentFrame, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';

import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {
	getTimeSeriesInterpolatedExtentFromVisibleDomainIndices,
	periodsScale,
	TPeriodsScale,
} from '../../../../acetti-ts-periodsScale/periodsScale';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

export type TYScaleAnimationContext = {
	test: string;
	// periodsScale: TPeriodsScale;
	// frame: number;
	// currentTransitionInfo: {
	// 	index: number;
	// 	frameRange: TFrameRange;
	// 	durationInFrames: number;
	// 	durationInSeconds: number;
	// 	relativeFrame: number;
	// 	framesPercentage: number;
	// 	easingPercentage: number;
	// 	fromDomainIndices: [number, number];
	// 	toDomainIndices: [number, number];
	// 	numberOfSlices: number;
	// 	transitionType: 'ZOOM' | 'DEFAULT';
	// };
	// currentSliceInfo: {
	// 	index: number;
	// 	frameRange: TFrameRange;
	// 	durationInFrames: number;
	// 	durationInSeconds: number;
	// 	relativeFrame: number;
	// 	framesPercentage: number;
	// 	easingPercentage: number;
	// 	domainIndicesTo: [number, number];
	// 	domainIndicesFrom: [number, number];
	// 	periodsScaleFrom: TPeriodsScale;
	// 	periodsScaleTo: TPeriodsScale;
	// };
};

type TChildrenFuncArgs = TYScaleAnimationContext;

type TTransitionSpec = {
	durationInFrames: number;
	easingFunction: (t: number) => number;
	numberOfSlices?: number;
	transitionType: 'DEFAULT' | 'ZOOM';
};

// type TTransitionsItem = {
// 	fromDomainIndices: [number, number];
// 	toDomainIndices: [number, number];
// 	transitionSpec: TTransitionSpec;
// };

export const YScaleAnimationContainer: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	// timeSeries: TimeSeries;
	// area: TGridLayoutArea;
	// transitions: TTransitionsItem[];
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({
	// timeSeries, // TODO array of periods is enough!
	// area,
	// transitions,
	periodScaleAnimationContext,
	children,
}) => {
	// const transitionSpecs = transitions.map((it) => it.transitionSpec);

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// const currentTransitionType = currentTransitionSpec.transitionType;
	// const currentTransitionType = "ZOOM";
	const currentTransitionType = 'DEFAULT';

	// ***********************************
	// TODO deprecate the y Axis stuff.....
	// ***********************************

	// let yScale: ScaleLinear<number, number>;

	// const yDomainProp = null;

	// if (currentTransitionType === 'DEFAULT') {
	// 	// TODO yDomainType is not addressed here!
	// 	const yDomain =
	// 		yDomainProp ||
	// 		getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(timeSeries, [
	// 			animatedVisibleDomainIndexStart,
	// 			animatedVisibleDomainIndexEnd,
	// 		] as [number, number]);

	// 	yScale = scaleLinear()
	// 		.domain(yDomain)
	// 		// TODO domain zero to be added via yDomainType
	// 		// .domain(yDomainZero)
	// 		.range([area.height, 0]);
	// 	// } else if (currentTransitionType === 'ZOOM') {
	// } else if (currentTransitionType === 'ZOOM') {
	// 	const yDomainFrom = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
	// 		timeSeries,
	// 		fromDomainIndices
	// 	);
	// 	const yDomainTo = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
	// 		timeSeries,
	// 		toDomainIndices
	// 	);

	// 	const animatedYDomain_0 = interpolate(
	// 		currentTransitionInfo.easingPercentage,
	// 		[0, 1],
	// 		[yDomainFrom[0], yDomainTo[0]]
	// 	);
	// 	const animatedYDomain_1 = interpolate(
	// 		currentTransitionInfo.easingPercentage,
	// 		[0, 1],
	// 		[yDomainFrom[1], yDomainTo[1]]
	// 	);

	// 	const zoomingCurrentYDomain = [animatedYDomain_0, animatedYDomain_1] as [
	// 		number,
	// 		number
	// 	];

	// 	yScale = scaleLinear()
	// 		.domain(zoomingCurrentYDomain)
	// 		// TODO domain zero to be added via yDomainType
	// 		// .domain(yDomainZero)
	// 		.range([area.height, 0]);
	// } else {
	// 	throw Error('Unknown transitionType');
	// }

	return (
		<Sequence from={0} durationInFrames={durationInFrames} layout="none">
			{children({
				// periodsScale: currentPeriodsScale,
				// yScale,
				// frame,
				// currentTransitionInfo,
				// currentSliceInfo,
				test: 'encho',
			})}
		</Sequence>
	);
};

type TFrameRange = {
	startFrame: number;
	endFrame: number;
};
