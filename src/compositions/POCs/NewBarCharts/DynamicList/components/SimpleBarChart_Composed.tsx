import React from 'react';
import {Sequence, useVideoConfig} from 'remotion';

import {TypographyStyle} from '../../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {getPerfectBaselineForHeight} from '../packages/BarChartAnimation/getPerfectBaselineForHeight';
import {HtmlArea, DisplayGridRails} from '../../../../../acetti-layout';
import {SimpleBarChart} from './SimpleBarChart';
import {
	useMatrixLayout,
	getMatrixLayoutCellArea,
} from '../../../../../acetti-layout/hooks/useMatrixLayout';
import {TBarChartItem} from '../packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {ThemeType} from '../../../../../acetti-themes/themeTypes';
import {usePage} from '../../../../../acetti-components/PageContext';
import {TextAnimationSubtle} from '../../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export const SimpleBarChart_Composed: React.FC<{
	dataLeft: TBarChartItem[];
	dataRight: TBarChartItem[];
	dataUpperLeftDelayInSeconds?: number;
	dataUpperRightDelayInSeconds?: number;
	theme: ThemeType;
	width: number;
	height: number;
	fitItemsHeight?: boolean;
	hideAxis?: boolean;
	showLayout?: boolean;
	titleLeft: string;
	titleRight: string;
	valueLabelFormatterLeft?: (value: number) => string; // either this OR pass ValueLabelComponent
	valueLabelFormatterRight?: (value: number) => string; // either this OR pass ValueLabelComponent
}> = ({
	theme,
	width,
	height,
	dataLeft,
	dataRight,
	titleLeft,
	titleRight,
	dataUpperLeftDelayInSeconds = 0,
	dataUpperRightDelayInSeconds = 0,
	fitItemsHeight = true,
	hideAxis = false,
	showLayout = false,
	valueLabelFormatterLeft,
	valueLabelFormatterRight,
}) => {
	// const LabelComponent = DefaultLabelComponent;
	// const ValueLabelComponent = DefaultValueLabelComponent;

	const {fps} = useVideoConfig();
	const {baseline: pageBaseline} = usePage();

	const titleTypographyStyle = theme.typography.textStyles.h2;
	const titleMarginBottomInBaselines = 2;

	const titleCapHeight =
		titleTypographyStyle.capHeightInBaselines * pageBaseline;
	const titleMarginBottom = titleMarginBottomInBaselines * pageBaseline;

	const titleHeightInPixels = titleCapHeight + titleMarginBottom;

	const matrixLayout = useMatrixLayout({
		width,
		height,
		nrColumns: 2,
		nrRows: 2,
		rowSpacePixels: 0,
		columnSpacePixels: pageBaseline * 3,
		rowPaddingPixels: 0,
		columnPaddingPixels: 0,
		rowSizes: [
			{type: 'pixel', value: titleHeightInPixels},
			{type: 'fr', value: 1},
		],
		columnSizes: [
			{type: 'fr', value: 2},
			{type: 'fr', value: 1},
		],
	});
	const areaUpperLeft = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 0,
	});
	const areaUpperRight = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 1,
		column: 1,
	});

	const areaUpperLeftTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 0,
	});
	const areaUpperRightTitle = getMatrixLayoutCellArea({
		layout: matrixLayout,
		row: 0,
		column: 1,
	});

	// TODO pass xAxis visible flag
	const baselineUpperLeft = getPerfectBaselineForHeight({
		height: areaUpperLeft.height,
		theme,
		nrItems: dataLeft.length,
		hideAxis,
	});

	const baselineUpperRight = getPerfectBaselineForHeight({
		height: areaUpperRight.height,
		theme,
		nrItems: dataRight.length,
		hideAxis,
	});

	const smallestCommonBaseline = Math.min(
		baselineUpperLeft,
		baselineUpperRight
	);

	// TODO f(plotAreaWidth, baseline)
	const nrTicks = 4;

	return (
		<>
			<div style={{position: 'relative'}}>
				{showLayout ? <DisplayGridRails {...matrixLayout} /> : null}

				{/* bar chart 1 */}
				<Sequence
					from={Math.floor(fps * dataUpperLeftDelayInSeconds)}
					layout="none"
				>
					<HtmlArea area={areaUpperLeftTitle}>
						<TypographyStyle
							typographyStyle={titleTypographyStyle}
							baseline={pageBaseline}
							marginBottom={titleMarginBottomInBaselines}
						>
							<TextAnimationSubtle>{titleLeft}</TextAnimationSubtle>
						</TypographyStyle>
					</HtmlArea>

					<Sequence from={Math.floor(fps * 0.5)} layout="none">
						<HtmlArea area={areaUpperLeft}>
							<SimpleBarChart
								showLayout={showLayout}
								hideAxis={hideAxis}
								fitItemsHeight={fitItemsHeight}
								height={areaUpperLeft.height}
								baseline={smallestCommonBaseline}
								width={areaUpperLeft.width}
								theme={theme}
								dataItems={dataLeft}
								nrTicks={nrTicks}
								valueLabelFormatter={valueLabelFormatterLeft}
							/>
						</HtmlArea>
					</Sequence>
				</Sequence>

				{/* bar chart 2 */}
				<Sequence
					from={Math.floor(fps * dataUpperRightDelayInSeconds)}
					layout="none"
				>
					<HtmlArea area={areaUpperRightTitle}>
						<TypographyStyle
							typographyStyle={titleTypographyStyle}
							baseline={pageBaseline}
							marginBottom={titleMarginBottomInBaselines}
						>
							<TextAnimationSubtle>{titleRight}</TextAnimationSubtle>
						</TypographyStyle>
					</HtmlArea>

					<Sequence from={Math.floor(fps * 0.5)} layout="none">
						<HtmlArea area={areaUpperRight}>
							<SimpleBarChart
								hideLabel
								showLayout={showLayout}
								hideAxis={hideAxis}
								fitItemsHeight={fitItemsHeight}
								height={areaUpperRight.height}
								baseline={smallestCommonBaseline}
								width={areaUpperRight.width}
								theme={theme}
								dataItems={dataRight}
								nrTicks={nrTicks}
								valueLabelFormatter={valueLabelFormatterRight}
							/>
						</HtmlArea>
					</Sequence>
				</Sequence>
			</div>
		</>
	);
};
