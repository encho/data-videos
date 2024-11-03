import {Sequence, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import invariant from 'tiny-invariant';
import {forwardRef, useCallback} from 'react';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {TextAnimationSubtle} from '../../compositions/POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {useElementDimensions} from '../../compositions/POCs/03-Page/SimplePage/useElementDimensions';
import {
	getKeyFramesInterpolator,
	TKeyFramesGroup,
} from '../../compositions/POCs/Keyframes/Keyframes/keyframes';
import {DisplayGridRails, HtmlArea, TGridLayoutArea} from '../../acetti-layout';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {TypographyStyle} from '../../compositions/POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useBarChartKeyframes} from './useBarChartKeyframes';
import {getBarChartBaseline, useBarChartLayout} from './useBarChartLayout';
import {TBarChartLayout} from './useBarChartLayout';
import {TSimpleBarChartData} from './SimpleBarChart';

export function useAnimatedBarChartLayout({
	theme,
	baseline,
	width,
	data,
	labelWidth,
	valueLabelWidth,
	negativeValueLabelWidth,
	hideLabels = false,
	valueDomain,
}: {
	theme: ThemeType;
	baseline: number;
	width: number;
	data: TSimpleBarChartData;
	labelWidth?: number;
	valueLabelWidth?: number;
	negativeValueLabelWidth?: number;
	hideLabels?: boolean;
	valueDomain: [number, number];
}): TBarChartLayout {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	// TODO better as prop i thing
	const barChartKeyframes = useBarChartKeyframes({
		fps,
		durationInFrames,
		data,
		// keyframes,
	});

	const barChartLayout = useBarChartLayout({
		baseline,
		theme,
		data,
		width,
		labelWidth,
		valueLabelWidth,
		negativeValueLabelWidth,
	});

	// the keyframes for the labels
	// -------------------------------------------------------------------
	// const labelKeyframes = barChartKeyframes.keyFrames.filter((kf) =>
	// 	kf.id.startsWith('LABEL_APPEAR__')
	// );

	const barWidthScale: ScaleLinear<number, number> = scaleLinear()
		.domain(valueDomain)
		.range([0, barChartLayout.getBarArea(0).width]);

	const zeroLineX = barWidthScale(0);

	const getBarArea = (i: string | number): TGridLayoutArea => {
		const dataIndex =
			typeof i === 'number' ? i : data.findIndex((it) => it.id === i);

		const it = data[dataIndex];
		const fullBarWidth = Math.abs(barWidthScale(it.value) - zeroLineX);

		const interpolateCurrentBarWidth = getKeyFramesInterpolator(
			barChartKeyframes,
			[
				`BAR_ENTER_START__${it.id}`,
				`BAR_ENTER_END__${it.id}`,
				`BAR_EXIT_START__${it.id}`,
				`BAR_EXIT_END__${it.id}`,
			],
			[0, fullBarWidth, fullBarWidth, 0],
			[Easing.ease, Easing.ease, Easing.ease]
		);

		const currentBarWidth = interpolateCurrentBarWidth(frame);

		const originalBarArea = barChartLayout.getBarArea(i);

		// const animatedBarArea: TGridLayoutArea = {
		// 	x1: originalBarArea.x1,
		// 	x2: originalBarArea.x1 + fullBarWidth,
		// 	y1: originalBarArea.y1,
		// 	y2: originalBarArea.y2,
		// 	height: originalBarArea.height,
		// 	width: fullBarWidth,
		// };
		const animatedBarArea: TGridLayoutArea = {
			x1: originalBarArea.x1,
			x2: originalBarArea.x1 + currentBarWidth,
			y1: originalBarArea.y1,
			y2: originalBarArea.y2,
			height: originalBarArea.height,
			width: currentBarWidth,
		};

		return animatedBarArea;
	};

	const getValueLabelArea = (i: string | number): TGridLayoutArea => {
		const dataIndex =
			typeof i === 'number' ? i : data.findIndex((it) => it.id === i);

		const it = data[dataIndex];

		const animatedBarArea = getBarArea(i);

		// const fullPossibleWidth = barChartLayout.getBar

		const positiveValueLabelMarginLeft =
			+1 *
			(animatedBarArea.width -
				(barChartLayout.getBarArea(i).width + zeroLineX));

		// const negativeValueLabelMarginLeft =
		// 	-1 * (zeroLineX - animatedBarArea.width);

		const marginLeft = it.value >= 0 ? positiveValueLabelMarginLeft : 0;
		// const marginRight = it.value >= 0 ? 0 : negativeValueLabelMarginLeft;

		const originalValueLabelArea =
			it.value >= 0
				? barChartLayout.getValueLabelArea(i)
				: barChartLayout.getNegativeValueLabelArea(i);

		const animatedValueLabelArea: TGridLayoutArea =
			it.value >= 0
				? {
						x1: originalValueLabelArea.x1 + marginLeft,
						x2: originalValueLabelArea.x2 + marginLeft,
						y1: originalValueLabelArea.y1,
						y2: originalValueLabelArea.y2,
						height: originalValueLabelArea.height,
						width: originalValueLabelArea.width,
				  }
				: {
						x1: originalValueLabelArea.x1,
						x2: originalValueLabelArea.x2,
						y1: originalValueLabelArea.y1,
						y2: originalValueLabelArea.y2,
						height: originalValueLabelArea.height,
						width: originalValueLabelArea.width,
				  };

		return animatedValueLabelArea;
	};

	return {...barChartLayout, getBarArea, getValueLabelArea};
}
