import chroma from 'chroma-js';

import {ThemeType} from './themeTypes';
import {isVideoSize} from '../Root';
import {colorPalettes} from './tailwindPalettes';

// const GRAYS = colorPalettes.Zinc;
// const GRAYS = colorPalettes.Stone;
// const GRAYS = colorPalettes.Slate;
const GRAYS = colorPalettes.Neutral;
// const GRAYS = colorPalettes.Blue;
// const GRAYS = colorPalettes.Orange;

const platteBackground = '#232323';
const platteBorder = '#292929';

const palette = {
	background: GRAYS['50'],
	typography: {
		title: {
			main: GRAYS['900'],
		},
		axis: {
			main: {
				tickLabel: GRAYS['400'],
				line: GRAYS['400'],
				tick: 'magenta',
			},
		},
	},
};

const dataScale = chroma
	.scale(['#fff', '#f05122', '#555'])
	.mode('lab')
	.colors(6);

export const lorenzobertoliniTheme = ({
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
			backgroundColor: palette.background,
			platteColor: GRAYS['800'],
		},

		typography: {
			// TODO deprecate
			title: {
				fontFamily: 'Inter-Bold',
				// fontFamily: 'SourceSerifPro-Light',
				color: '#ffffff',
			},
			// TODO deprecate
			subTitle: {
				fontFamily: 'Inter-Medium',
				color: '#666',
			},
			// TODO deprecate
			titleColor: '#666', // TODO deprecate
			// TODO deprecate
			subTitleColor: '#888',
			// TODO deprecate
			textColor: '#ffffff',
			// TODO deprecate
			logoColor: palette.typography.title.main, // TODO own section in theme (as highly individual)
			textStyles: {
				h1: {
					fontFamily: 'Inter-28pt-Black',
					// fontFamily: 'Inter-28pt-Thin',
					capHeightInBaselines: 3,
					lineGapInBaselines: 1.75,
					color: palette.typography.title.main,
				},
				h2: {
					fontFamily: 'Inter-Regular',
					// fontFamily: 'Inter-28pt-Thin',
					capHeightInBaselines: 2,
					lineGapInBaselines: 1.5,
					color: palette.typography.title.main,
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
					color: GRAYS['100'],
				},
				datavizValueLabel: {
					fontFamily: 'Inter-Bold',
					capHeightInBaselines: 0.85,
					lineGapInBaselines: 1,
					// color: '#64748b',
					// color: GRAYS['500'],
					color: GRAYS['300'],
				},
				datavizTickLabel: {
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 0.8,
					lineGapInBaselines: 1,
					// color: GRAYS['600'],
					color: palette.typography.axis.main.tickLabel,
				},
				dataSource: {
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 1,
					lineGapInBaselines: 0.75,
					color: palette.typography.title.main,
				},
			},
		},

		yAxis: {
			fontSize: 16,
			strokeWidth: 3,
			// color: textColor,
			// color: GRAYS['600'],
			// color: GRAYS['400'],
			color: palette.typography.axis.main.line,
			tickColor: palette.typography.axis.main.tick,
		},
		xAxis: {
			fontSize: 16,
			strokeWidth: 3,
			// color: textColor,
			color: GRAYS['600'],
			tickColor: GRAYS['600'],
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
			barsColor: palette.typography.title.main, // TODO change
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
