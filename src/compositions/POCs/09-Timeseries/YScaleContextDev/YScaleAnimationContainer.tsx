import {Sequence, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {getTimeSeriesInterpolatedExtentFromVisibleDomainIndices} from '../../../../acetti-ts-periodsScale/periodsScale';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

export const Y_SCALE_PADDING_PERC = 0.1;

export type TYScaleAnimationContext = {
	test: string;
	yScale: ScaleLinear<number, number>;
};

type TChildrenFuncArgs = TYScaleAnimationContext;

export const YScaleAnimationContainer: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({periodScaleAnimationContext, area, timeSeries, children}) => {
	const {durationInFrames} = useVideoConfig();

	const currentTransitionType =
		periodScaleAnimationContext.currentTransitionInfo.transitionType;

	// ***********************************
	// TODO deprecate the y Axis stuff.....
	// ***********************************

	const animatedVisibleDomainIndexStart =
		periodScaleAnimationContext.periodsScale.visibleDomainIndices[0];
	const animatedVisibleDomainIndexEnd =
		periodScaleAnimationContext.periodsScale.visibleDomainIndices[1];

	const fromDomainIndices =
		periodScaleAnimationContext.currentSliceInfo.domainIndicesFrom;
	const toDomainIndices =
		periodScaleAnimationContext.currentSliceInfo.domainIndicesTo;

	let yScale: ScaleLinear<number, number>;

	// TODO introduce capacity of passing yDomain into the machine
	const yDomainProp = undefined;

	if (currentTransitionType === 'DEFAULT') {
		// TODO yDomainType is not addressed here!
		const yDomain =
			yDomainProp ||
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				timeSeries,
				[animatedVisibleDomainIndexStart, animatedVisibleDomainIndexEnd] as [
					number,
					number
				],
				Y_SCALE_PADDING_PERC
			);

		yScale = scaleLinear()
			.domain(yDomain)
			// TODO domain zero to be added via yDomainType
			// .domain(yDomainZero)
			.range([area.height, 0]);
		// } else if (currentTransitionType === 'ZOOM') {
	} else if (currentTransitionType === 'ZOOM') {
		const yDomainFrom = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			fromDomainIndices,
			Y_SCALE_PADDING_PERC
		);
		const yDomainTo = getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
			timeSeries,
			toDomainIndices,
			Y_SCALE_PADDING_PERC
		);

		const animatedYDomain_0 = interpolate(
			periodScaleAnimationContext.currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[0], yDomainTo[0]]
		);
		const animatedYDomain_1 = interpolate(
			periodScaleAnimationContext.currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[1], yDomainTo[1]]
		);

		const zoomingCurrentYDomain = [animatedYDomain_0, animatedYDomain_1] as [
			number,
			number
		];

		yScale = scaleLinear()
			.domain(zoomingCurrentYDomain)
			// TODO domain zero to be added via yDomainType
			// .domain(yDomainZero)
			.range([area.height, 0]);
	} else {
		throw Error('Unknown transitionType');
	}

	return (
		<Sequence from={0} durationInFrames={durationInFrames} layout="none">
			{children({
				test: 'encho', // TODO remove
				yScale,
			})}
		</Sequence>
	);
};
