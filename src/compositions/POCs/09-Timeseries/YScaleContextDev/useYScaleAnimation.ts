import {interpolate} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {useMemo, useState, useCallback} from 'react';

import {usePage} from '../../../../acetti-components/PageContext';
import {getTextDimensions} from '../../../../acetti-typography/CapSizeTextNew';
import {TimeSeries} from '../../../../acetti-ts-utils/timeSeries/generateBrownianMotionTimeSeries';
import {getTimeSeriesInterpolatedExtentFromVisibleDomainIndices} from '../../../../acetti-ts-periodsScale/periodsScale';
import {TPeriodScaleAnimationContext} from '../../../../acetti-ts-base/PeriodScaleAnimationContainer';
import {
	getYAxisSpec,
	TYAxisSpec,
} from '../../../../acetti-ts-axis/utils/axisSpecs_yAxis';

export type TYScaleAnimationContext = {
	yScale: ScaleLinear<number, number>;
	yScaleFrom: ScaleLinear<number, number>;
	yScaleTo: ScaleLinear<number, number>;
	yAxisSpecFrom: TYAxisSpec;
	yAxisSpecTo: TYAxisSpec;
	maxLabelComponentWidth: number;
	setYScalesHeight: (x: number) => void;
};

type Args = {
	periodScaleAnimation: TPeriodScaleAnimationContext;
	nrTicks?: number;
	tickFormatter: (x: number) => string; // TODO evtl. TickComponent better, more flexible
	yScalesInitialHeight?: number;
	timeSeriesArray: TimeSeries[];
	domainType: 'ZERO' | 'VISIBLE';
	paddingPerc?: number;
};

export function useYScaleAnimation({
	periodScaleAnimation,
	nrTicks = 5,
	tickFormatter,
	domainType,
	yScalesInitialHeight = 500,
	timeSeriesArray,
	paddingPerc = 0.1,
}: Args): TYScaleAnimationContext {
	const {theme, baseline} = usePage();

	const [yScalesHeight, setYScalesHeight] =
		useState<number>(yScalesInitialHeight);

	const getYDomain = useCallback(
		(domainIndices: [number, number]) => {
			const yDomainsForEachTimeSeries = timeSeriesArray.map((ts) =>
				getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
					ts,
					domainIndices,
					paddingPerc
				)
			);

			const yDomainDataMin = Math.min(
				...yDomainsForEachTimeSeries.map((it) => it[0])
			);
			const yDomainDataMax = Math.max(
				...yDomainsForEachTimeSeries.map((it) => it[1])
			);
			const yDomainData = [yDomainDataMin, yDomainDataMax] as [number, number];

			const yDomain =
				domainType === 'VISIBLE'
					? yDomainData
					: ([0, yDomainData[1]] as [number, number]);

			return yDomain;
		},
		[timeSeriesArray, paddingPerc, domainType]
	);

	const yScalesRange = [yScalesHeight, 0] as [number, number];

	const currentTransitionType =
		periodScaleAnimation.currentTransitionInfo.transitionType;

	const animatedVisibleDomainIndexStart =
		periodScaleAnimation.periodsScale.visibleDomainIndices[0];
	const animatedVisibleDomainIndexEnd =
		periodScaleAnimation.periodsScale.visibleDomainIndices[1];

	const domainIndicesFrom =
		periodScaleAnimation.currentSliceInfo.domainIndicesFrom;
	const domainIndicesTo = periodScaleAnimation.currentSliceInfo.domainIndicesTo;

	const yDomainFrom = getYDomain(domainIndicesFrom);
	const yDomainTo = getYDomain(domainIndicesTo);

	let yScale: ScaleLinear<number, number>;

	// TODO introduce capacity of passing yDomain into the machine
	// OR: do not ship this functionality?
	// const yDomainProp = undefined;

	if (currentTransitionType === 'DEFAULT') {
		const yDomain = getYDomain([
			animatedVisibleDomainIndexStart,
			animatedVisibleDomainIndexEnd,
		] as [number, number]);

		yScale = scaleLinear().domain(yDomain).range(yScalesRange);
	} else if (currentTransitionType === 'ZOOM') {
		const animatedYDomain_0 = interpolate(
			periodScaleAnimation.currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[0], yDomainTo[0]]
		);
		const animatedYDomain_1 = interpolate(
			periodScaleAnimation.currentTransitionInfo.easingPercentage,
			[0, 1],
			[yDomainFrom[1], yDomainTo[1]]
		);

		const zoomingCurrentYDomain = [animatedYDomain_0, animatedYDomain_1] as [
			number,
			number
		];

		yScale = scaleLinear().domain(zoomingCurrentYDomain).range(yScalesRange);
	} else {
		throw Error('Unknown transitionType');
	}

	// range is not needed as we only calculate domainValues for labels and ticks,
	// then the current yScale is used to compute the mappings
	const yScaleFrom: ScaleLinear<number, number> =
		scaleLinear().domain(yDomainFrom);

	// range is not needed as we only calculate domainValues for labels and ticks,
	// then the current yScale is used to compute the mappings
	const yScaleTo: ScaleLinear<number, number> = scaleLinear().domain(yDomainTo);

	const yAxisSpecFrom = getYAxisSpec(yScaleFrom, nrTicks, tickFormatter);
	const yAxisSpecTo = getYAxisSpec(yScaleTo, nrTicks, tickFormatter);

	// TODO here determine all ever displayed labels... from allTransitionsAndSLicesOverview
	const allEverDisplayedLabels = useMemo(() => {
		const periodsLabels =
			periodScaleAnimation.allTransitionsAndSlicesOverview.map((transition) => {
				const slicesLabels = transition.slices.map(
					({domainIndicesFrom, domainIndicesTo}) => {
						const yDomainFrom = getYDomain(domainIndicesFrom);
						const yDomainTo = getYDomain(domainIndicesTo);

						const yScaleFrom: ScaleLinear<number, number> =
							scaleLinear().domain(yDomainFrom);

						const yScaleTo: ScaleLinear<number, number> =
							scaleLinear().domain(yDomainTo);

						const yAxisSpecFrom = getYAxisSpec(
							yScaleFrom,
							nrTicks,
							tickFormatter
						);
						const yAxisSpecTo = getYAxisSpec(yScaleTo, nrTicks, tickFormatter);

						const tickLabelsFrom = yAxisSpecFrom.labels.map((it) => it.label);
						const tickLabelsTo = yAxisSpecTo.labels.map((it) => it.label);

						return [...tickLabelsFrom, ...tickLabelsTo];
					}
				);
				return slicesLabels.flat();
			});
		return periodsLabels.flat();
	}, [
		periodScaleAnimation.allTransitionsAndSlicesOverview,
		nrTicks,
		tickFormatter,
	]);

	const allLabelsWidths = useMemo(
		() =>
			allEverDisplayedLabels.map(
				(text) =>
					getTextDimensions({
						theme,
						baseline,
						text,
						key: 'datavizTickLabel',
					}).width
			),
		[allEverDisplayedLabels]
	);

	const maxLabelWidth = useMemo(
		() => Math.max(...allLabelsWidths),
		[allLabelsWidths]
	);

	// TODO from theme, this is also used identically by Animated_YAxis...
	const TICK_LINE_SIZE = 24; // TODO into theme
	const MARGIN_LEFT = 0;

	const maxLabelComponentWidth = maxLabelWidth + TICK_LINE_SIZE + MARGIN_LEFT;

	return {
		yScale,
		yScaleFrom,
		yScaleTo,
		yAxisSpecFrom,
		yAxisSpecTo,
		maxLabelComponentWidth,
		setYScalesHeight,
	};
}
