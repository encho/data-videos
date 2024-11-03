import chroma from 'chroma-js';

import {ThemeType} from './themeTypes';
import {isVideoSize} from '../Root';
import {colorPalettes} from './tailwindPalettes';

const textColor = chroma('#888').hex();
// const backgroundColor = chroma('#222222').darken().hex();
// const backgroundColor = chroma('#222222').darken().hex();

// const platteBackground = '#202020';
const platteBackground = '#232323';
const platteBorder = '#292929';

// TODO a component that visualizes the data colors!
// const dataScale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(6);
// const dataScale = chroma.scale(['#f05122', '#ffff00']).mode('lch').colors(6);
// const dataScale = chroma.scale(['lightgreen', 'magenta']).mode('lab').colors(6);
// const dataScale = chroma.scale(['cyan', 'magenta']).mode('lab').colors(6);
const dataScale = chroma
	.scale(['#fff', '#f05122', '#555'])
	.mode('lab')
	.colors(6);

export const nerdyTheme = ({
	width,
	height,
}: {
	width: number;
	height: number;
}): ThemeType => {
	const PAGE_MARGIN_TOP = width / 20;
	const PAGE_MARGIN_BOTTOM = width / 20;
	const PAGE_MARGIN_LEFT = width / 20;
	const PAGE_MARGIN_RIGHT = width / 20;
	const PAGE_CONTENT_HEIGHT = height - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM;
	const PAGE_CONTENT_WIDTH = width - PAGE_MARGIN_RIGHT - PAGE_MARGIN_LEFT;
	const PAGE_BASELINE = isVideoSize({width, height}, 'widescreen_16x9')
		? PAGE_CONTENT_HEIGHT / 50
		: PAGE_CONTENT_WIDTH / 50;

	const page = {
		marginTop: PAGE_MARGIN_TOP,
		marginBottom: PAGE_MARGIN_BOTTOM,
		marginLeft: PAGE_MARGIN_LEFT,
		marginRight: PAGE_MARGIN_RIGHT,
		contentWidth: PAGE_CONTENT_WIDTH,
		contentHeight: PAGE_CONTENT_HEIGHT,
		baseline: PAGE_BASELINE,
	};

	return {
		page,
		global: {
			backgroundColor: colorPalettes['Slate']['950'],
			platteColor: colorPalettes['Slate']['800'],
		},
		typography: {
			title: {
				fontFamily: 'Inter-Bold',
				// fontFamily: 'SourceSerifPro-Light',
				color: '#ffffff',
			},
			subTitle: {
				fontFamily: 'Inter-Medium',
				color: '#666',
			},
			titleColor: '#666', // TODO deprecate
			subTitleColor: '#888',
			textColor: '#ffffff',
			// logoColor: '#666',
			logoColor: colorPalettes['Slate']['600'],
			textStyles: {
				h1: {
					fontFamily: 'Inter-28pt-Black',
					// fontFamily: 'Inter-28pt-Thin',
					capHeightInBaselines: 3,
					lineGapInBaselines: 1.75,
					// color: colorPalettes['Slate']['200'],
					color: colorPalettes['Slate']['500'],
				},
				h2: {
					fontFamily: 'Inter-Regular',
					// fontFamily: 'Inter-28pt-Thin',
					capHeightInBaselines: 2,
					lineGapInBaselines: 1.5,
					// color: '#777',
					color: colorPalettes['Slate']['500'],
				},
				h3: {
					fontFamily: 'Inter-Bold',
					capHeightInBaselines: 1.5,
					lineGapInBaselines: 1.5,
					color: '#fff',
				},
				body: {
					// fontFamily: 'Inter-28pt-Thin',
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 1,
					lineGapInBaselines: 0.5,
					color: '#fff',
				},
				datavizLabel: {
					// TODO load alos Inter-Medium
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 1,
					lineGapInBaselines: 1,
					// color: '#888',
					color: colorPalettes['Slate']['100'],
				},
				datavizValueLabel: {
					fontFamily: 'Inter-Bold',
					capHeightInBaselines: 0.85,
					lineGapInBaselines: 1,
					// color: '#64748b',
					// color: colorPalettes['Slate']['500'],
					color: colorPalettes['Slate']['300'],
				},
				datavizTickLabel: {
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 0.8,
					lineGapInBaselines: 1,
					// color: colorPalettes['Slate']['600'],
					color: colorPalettes['Slate']['400'],
				},
				dataSource: {
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 1,
					lineGapInBaselines: 0.75,
					color: colorPalettes['Slate']['600'],
				},
			},
		},

		yAxis: {
			fontSize: 16,
			strokeWidth: 3,
			// color: textColor,
			// color: colorPalettes['Slate']['600'],
			color: colorPalettes['Slate']['400'],
			tickColor: colorPalettes['Slate']['600'],
		},
		xAxis: {
			fontSize: 16,
			strokeWidth: 3,
			// color: textColor,
			color: colorPalettes['Slate']['600'],
			tickColor: colorPalettes['Slate']['600'],
		},
		candlesticks: {
			up: {
				bodyColor: '#222',
				bodyStrokeColor: '#555',
				lineColor: '#333',
				strokeWidth: 2,
			},
			down: {
				bodyColor: '#222',
				bodyStrokeColor: '#111',
				lineColor: '#444',
				strokeWidth: 2,
			},
		},
		positiveNegativeColors: {
			positiveColor: colorPalettes.Emerald['500'],
			negativeColor: colorPalettes.Rose['600'],
		},
		dataColors: [
			{
				M3: '#333',
				M2: '#555',
				M1: '#ff0000',
				BASE: dataScale[0],
				P1: '#666',
				P2: '#566',
				P3: '#444',
			},
			{
				M3: '#333',
				M2: '#555',
				M1: 'cyan',
				BASE: dataScale[1],
				P1: 'magenta',
				P2: '#566',
				P3: '#444',
			},
			{
				M3: '#333',
				M2: '#555',
				M1: 'cyan',
				BASE: dataScale[2],
				P1: 'magenta',
				P2: '#566',
				P3: '#444',
			},
			{
				M3: '#333',
				M2: '#555',
				M1: 'cyan',
				BASE: dataScale[3],
				P1: 'magenta',
				P2: '#566',
				P3: '#444',
			},
			{
				M3: '#333',
				M2: '#555',
				M1: 'cyan',
				BASE: dataScale[4],
				P1: 'magenta',
				P2: '#566',
				P3: '#444',
			},
			{
				M3: '#333',
				M2: '#555',
				M1: 'cyan',
				BASE: dataScale[5],
				P1: 'magenta',
				P2: '#566',
				P3: '#444',
			},
		],
		minimap: {
			lineColor: dataScale[2],
			areaColor: chroma(dataScale[2]).hex(),
			// areaColor: '#ff0000',
			areaOpacity: 0.2,
		},
		platte: {
			backgroundColor: platteBackground,
			borderColor: platteBorder,
		},
		TypographicLayouts: {
			baselineGrid: {
				lineColor: '#4a4a4a',
			},
			gridLayout: {
				lineColor: '#f05122',
				activeAreaFill: chroma('#f05122').alpha(0.45).css(),
			},
		},
		EconomistDataSource: {
			textColor: '#666',
		},
		TwoChangeBars: {
			barsColor: textColor,
		},
		SimpleKPI: {
			kpiColor: '#fff',
			labelColor: '#888',
		},
		timeseriesComponents: {
			percentageChangeArea: {
				lineColor: '#f05122',
				textColor: '#f05122',
				gradientColor: '#f05122',
				lineStrokeWidth: 0.8,
			},
			HighlightPeriodsArea: {
				backgroundColor: dataScale[3],
				backgroundOpacity: 0.4,
				borderColor: dataScale[3],
				textColor: dataScale[3],
			},
			// TODO: bring highlightArea here!! and rename to HighlightPeriodsArea
		},
	};
};
