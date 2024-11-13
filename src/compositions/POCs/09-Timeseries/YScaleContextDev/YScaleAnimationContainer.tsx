import {Sequence, interpolate, useVideoConfig} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {useMemo, useState} from 'react';

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
	//
	maxLabelComponentWidth: number;
	setYScalesHeight: (x: number) => void;
};

type TChildrenFuncArgs = TYScaleAnimationContext;

export const YScaleAnimationContainer: React.FC<{
	periodScaleAnimationContext: TPeriodScaleAnimationContext;
	nrTicks?: number;
	tickFormatter: (x: number) => string; // TODO evtl. TickComponent better, more flexible
	// area: TGridLayoutArea;
	yScalesInitialHeight?: number;
	timeSeriesArray: TimeSeries[];
	domainType: 'ZERO' | 'VISIBLE';
	paddingPerc?: number;
	children: (x: TChildrenFuncArgs) => React.ReactElement<any, any> | null;
}> = ({
	periodScaleAnimationContext,
	nrTicks = 5,
	tickFormatter,
	domainType,
	yScalesInitialHeight = 500,
	timeSeriesArray,
	paddingPerc = 0.1,
	children,
}) => {
	const {durationInFrames} = useVideoConfig();
	const {theme, baseline} = usePage();

	const [yScalesHeight, setYScalesHeight] =
		useState<number>(yScalesInitialHeight);

	const yScalesRange = [yScalesHeight, 0] as [number, number];

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
	// const yDomainProp = undefined;

	if (currentTransitionType === 'DEFAULT') {
		const yDomains = timeSeriesArray.map((ts) =>
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				ts,
				[animatedVisibleDomainIndexStart, animatedVisibleDomainIndexEnd] as [
					number,
					number
				],
				paddingPerc
			)
		);

		const yDomainDataMin = Math.min(...yDomains.map((it) => it[0]));
		const yDomainDataMax = Math.max(...yDomains.map((it) => it[1]));
		const yDomainData = [yDomainDataMin, yDomainDataMax] as [number, number];

		const yDomain =
			domainType === 'VISIBLE'
				? yDomainData
				: ([0, yDomainData[1]] as [number, number]);

		yScale = scaleLinear().domain(yDomain).range(yScalesRange);
	} else if (currentTransitionType === 'ZOOM') {
		// const yDomainFromData =
		// 	getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
		// 		timeSeries,
		// 		fromDomainIndices,
		// 		paddingPerc
		// 	);

		const yDomainsFrom = timeSeriesArray.map((ts) =>
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				ts,
				fromDomainIndices,
				paddingPerc
			)
		);

		const yDomainFromDataMin = Math.min(...yDomainsFrom.map((it) => it[0]));
		const yDomainFromDataMax = Math.max(...yDomainsFrom.map((it) => it[1]));
		const yDomainFromData = [yDomainFromDataMin, yDomainFromDataMax] as [
			number,
			number
		];

		const yDomainFrom =
			domainType === 'VISIBLE'
				? yDomainFromData
				: ([0, yDomainFromData[1]] as [number, number]);

		const yDomainsTo = timeSeriesArray.map((ts) =>
			getTimeSeriesInterpolatedExtentFromVisibleDomainIndices(
				ts,
				toDomainIndices,
				paddingPerc
			)
		);

		const yDomainToDataMin = Math.min(...yDomainsTo.map((it) => it[0]));
		const yDomainToDataMax = Math.max(...yDomainsTo.map((it) => it[1]));
		const yDomainToData = [yDomainToDataMin, yDomainToDataMax] as [
			number,
			number
		];

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

		yScale = scaleLinear().domain(zoomingCurrentYDomain).range(yScalesRange);
	} else {
		throw Error('Unknown transitionType');
	}

	// const yDomainFromData =
	// 	periodScaleAnimationContext.currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
	// 		timeSeries,
	// 		paddingPerc
	// 	);

	const yDomainsFrom = timeSeriesArray.map((ts) =>
		periodScaleAnimationContext.currentSliceInfo.periodsScaleFrom.getTimeSeriesInterpolatedExtent(
			ts,
			paddingPerc
		)
	);

	const yDomainFromDataMin = Math.min(...yDomainsFrom.map((it) => it[0]));
	const yDomainFromDataMax = Math.max(...yDomainsFrom.map((it) => it[1]));
	const yDomainFromData = [yDomainFromDataMin, yDomainFromDataMax] as [
		number,
		number
	];

	const yDomainFrom =
		domainType === 'VISIBLE'
			? yDomainFromData
			: ([0, yDomainFromData[1]] as [number, number]);

	const yDomainsTo = timeSeriesArray.map((ts) =>
		periodScaleAnimationContext.currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(
			ts,
			paddingPerc
		)
	);

	const yDomainToDataMin = Math.min(...yDomainsTo.map((it) => it[0]));
	const yDomainToDataMax = Math.max(...yDomainsTo.map((it) => it[1]));
	const yDomainToData = [yDomainToDataMin, yDomainToDataMax] as [
		number,
		number
	];

	// const yDomainToData =
	// 	periodScaleAnimationContext.currentSliceInfo.periodsScaleTo.getTimeSeriesInterpolatedExtent(
	// 		timeSeries,
	// 		paddingPerc
	// 	);

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

	const yAxisSpecFrom = getYAxisSpec(yScaleFrom, nrTicks, tickFormatter);
	const yAxisSpecTo = getYAxisSpec(yScaleTo, nrTicks, tickFormatter);

	// TODO here determine all ever displayed labels... from allTransitionsAndSLicesOverview
	const allEverDisplayedLabels = useMemo(
		() => ['1000 EUR', '1200 EUR'],
		[periodScaleAnimationContext.allTransitionsAndSlicesOverview]
	);

	// TODO useMemo
	const allLabelsWidths = allEverDisplayedLabels.map(
		(text) =>
			getTextDimensions({
				theme,
				baseline,
				text,
				key: 'datavizTickLabel',
			}).width
	);

	// TODO useMemo
	const maxLabelWidth = Math.max(...allLabelsWidths);

	// TODO from theme, this is also used identically by Animated_YAxis...
	const TICK_LINE_SIZE = 24; // TODO into theme
	const MARGIN_LEFT = 0;

	const maxLabelComponentWidth = maxLabelWidth + TICK_LINE_SIZE + MARGIN_LEFT;

	// console.log({yAxisSpecFrom, yAxisSpecTo});

	return (
		<Sequence from={0} durationInFrames={durationInFrames} layout="none">
			{children({
				yScale,
				yScaleFrom,
				yScaleTo,
				yAxisSpecFrom,
				yAxisSpecTo,
				maxLabelComponentWidth,
				setYScalesHeight,
			})}
		</Sequence>
	);
};
