import {Sequence, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';

import {TGridLayoutArea} from '../../../../acetti-layout';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {getTimeSeriesInterpolatedExtentFromVisibleDomainIndices} from '../../../../acetti-ts-periodsScale/periodsScale';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';

// export const Y_SCALE_PADDING_PERC = 0.1;

export type TYScaleAnimationContext = {
	yScale: ScaleLinear<number, number>;
	yScaleFrom: ScaleLinear<number, number>;
	yScaleTo: ScaleLinear<number, number>;
};

type TChildrenFuncArgs = TYScaleAnimationContext;

export const YScaleAnimationContainer: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	area: TGridLayoutArea;
	timeSeries: TimeSeries;
	domainType: 'ZERO' | 'VISIBLE';
	paddingPerc?: number;
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({
	periodScaleAnimationContext,
	domainType,
	area,
	timeSeries,
	paddingPerc = 0.1,
	children,
}) => {
	const {durationInFrames} = useVideoConfig();

	const currentTransitionType =
		periodScaleAnimationContext.currentTransitionInfo.transitionType;

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
	// OR: do not ship this functionality?
	const yDomainProp = undefined;

	if (currentTransitionType === 'DEFAULT') {
		const yDomainData =
			yDomainProp ||
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				timeSeries,
				[animatedVisibleDomainIndexStart, animatedVisibleDomainIndexEnd] as [
					number,
					number
				],
				paddingPerc
			);

		const yDomain =
			domainType === 'VISIBLE'
				? yDomainData
				: ([0, yDomainData[1]] as [number, number]);

		yScale = scaleLinear().domain(yDomain).range([area.height, 0]);
	} else if (currentTransitionType === 'ZOOM') {
		const yDomainFromData =
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				timeSeries,
				fromDomainIndices,
				paddingPerc
			);

		const yDomainFrom =
			domainType === 'VISIBLE'
				? yDomainFromData
				: ([0, yDomainFromData[1]] as [number, number]);

		const yDomainToData =
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				timeSeries,
				toDomainIndices,
				paddingPerc
			);

		const yDomainTo =
			domainType === 'VISIBLE'
				? yDomainToData
				: ([0, yDomainToData[1]] as [number, number]);

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
			.range([area.height, 0]);
	} else {
		throw Error('Unknown transitionType');
	}

	const yDomainFromData =
		periodScaleAnimationContext.currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
			timeSeries,
			paddingPerc
		);

	const yDomainToData =
		periodScaleAnimationContext.currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(
			timeSeries,
			paddingPerc
		);

	const yDomainFrom =
		domainType === 'VISIBLE'
			? yDomainFromData
			: ([0, yDomainFromData[1]] as [number, number]);

	const yDomainTo =
		domainType === 'VISIBLE'
			? yDomainToData
			: ([0, yDomainToData[1]] as [number, number]);

	// range is not needed as we only calculate domainValues for labels and ticks,
	// then the current yScale is used to compute the mappings
	const yScaleFrom: ScaleLinear<number, number> =
		scaleLinear().domain(yDomainFrom);

	// range is not needed as we only calculate domainValues for labels and ticks,
	// then the current yScale is used to compute the mappings
	const yScaleTo: ScaleLinear<number, number> = scaleLinear().domain(yDomainTo);

	return (
		<Sequence from={0} durationInFrames={durationInFrames} layout="none">
			{children({
				yScale,
				yScaleFrom,
				yScaleTo,
			})}
		</Sequence>
	);
};
