import chroma from 'chroma-js';

import {ThemeType} from './themeTypes';

// this theme is a mono colored theme
// const monoColor = "#f50274";
// const monoColor = '#f05122';
const monoColor = '#222';

const textColor = chroma('#9b9b9b').hex();
// const textColor = chroma(monoColor).brighten(2).hex();
// const backgroundColor = chroma('#222222').darken().hex();
// const backgroundColor = chroma('#f0f0f0').hex();
// const backgroundColor = chroma(monoColor).hex();
// const backgroundColor = chroma('#d0d0d0').hex();
// const backgroundColor = '#fff';
const backgroundColor = '#f0f0f0';

// TODO a component that visualizes the data colors!
// const dataScale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(6);
// const dataScale = chroma.scale(['#f05122', '#ffff00']).mode('lch').colors(6);
// const dataScale = chroma.scale(['lightgreen', 'magenta']).mode('lab').colors(6);
// const dataScale = chroma.scale(['cyan', 'magenta']).mode('lab').colors(6);
const dataScale = chroma
	.scale([monoColor, '#888888', '#0099cc'])
	.mode('lab')
	.colors(6);

export const lorenzobertolinibrightTheme = ({
	width,
	height,
}: {
	width: number;
	height: number;
}): ThemeType => {
	const PAGE_MARGIN_TOP = width / 30;
	const PAGE_MARGIN_BOTTOM = width / 30;
	const PAGE_MARGIN_LEFT = width / 30;
	const PAGE_MARGIN_RIGHT = width / 30;
	const PAGE_CONTENT_HEIGHT = height - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM;
	const PAGE_CONTENT_WIDTH = width - PAGE_MARGIN_RIGHT - PAGE_MARGIN_LEFT;
	const PAGE_BASELINE = PAGE_CONTENT_HEIGHT / 40;

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
		global: {backgroundColor, platteColor: 'yellow'},
		typography: {
			title: {
				fontFamily: 'Inter-Bold',
				color: '#999',
			},
			subTitle: {
				fontFamily: 'Inter-Medium',
				color: '#aaa',
			},
			titleColor: '#222222',
			subTitleColor: '#888888',
			textColor: '#222222',
			logoColor: '#888',
			textStyles: {
				h1: {
					fontFamily: 'Inter-Bold' as const,
					capHeightInBaselines: 3,
					lineGapInBaselines: 1,
					color: '#f05122',
				},
				h2: {
					fontFamily: 'Inter-Regular' as const,
					capHeightInBaselines: 2,
					lineGapInBaselines: 1,
					color: '#888',
				},
				h3: {
					fontFamily: 'Inter-Bold',
					capHeightInBaselines: 1.2,
					lineGapInBaselines: 1.5,
					color: '#fff',
				},
				body: {
					fontFamily: 'Inter-Regular' as const,
					capHeightInBaselines: 1,
					lineGapInBaselines: 1,
					color: '#222',
				},
				datavizLabel: {
					fontFamily: 'Inter-Regular' as const,
					capHeightInBaselines: 1,
					lineGapInBaselines: 1,
					color: '#555',
				},
				datavizValueLabel: {
					fontFamily: 'Inter-Bold' as const,
					capHeightInBaselines: 0.7,
					lineGapInBaselines: 1,
					color: '#555',
				},
				datavizTickLabel: {
					fontFamily: 'Inter-Bold',
					capHeightInBaselines: 1,
					lineGapInBaselines: 1,
					color: '#bbb',
				},
				dataSource: {
					fontFamily: 'Inter-Regular',
					capHeightInBaselines: 1,
					lineGapInBaselines: 1,
					color: 'magenta',
				},
			},
		},
		yAxis: {
			fontSize: 15,
			strokeWidth: 2,
			color: textColor,
			tickColor: textColor,
		},
		xAxis: {
			fontSize: 16,
			strokeWidth: 2,
			color: textColor,
			tickColor: textColor,
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
			positiveColor: 'cyan',
			negativeColor: 'magenta',
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
			backgroundColor: '#ffffff',
			borderColor: '#cccccc',
			// borderColor: '#ff0000',
			// backgroundColor: '#ffff00',
		},
		TypographicLayouts: {
			baselineGrid: {
				lineColor: '#aaa',
			},
			gridLayout: {
				lineColor: '#f05122',
				activeAreaFill: chroma('#f05122').alpha(0.35).css(),
			},
		},
		EconomistDataSource: {
			textColor: '#888',
		},
		TwoChangeBars: {
			barsColor: monoColor,
		},
		SimpleKPI: {
			kpiColor: textColor,
			labelColor: 'gray',
		},
		timeseriesComponents: {
			percentageChangeArea: {
				lineColor: monoColor,
				textColor: monoColor,
				gradientColor: monoColor,
				lineStrokeWidth: 1.5,
			},
			HighlightPeriodsArea: {
				backgroundColor: dataScale[3],
				backgroundOpacity: 0.4,
				borderColor: dataScale[3],
				textColor: dataScale[3],
			},
		},
	};
};
