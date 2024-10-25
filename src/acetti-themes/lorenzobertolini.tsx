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
const backgroundColor = chroma(monoColor).hex();

// TODO a component that visualizes the data colors!
// const dataScale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(6);
// const dataScale = chroma.scale(['#f05122', '#0033ff']).mode('lch').colors(6);
// const dataScale = chroma.scale(['lightgreen', 'magenta']).mode('lab').colors(6);
// const dataScale = chroma.scale(['cyan', 'magenta']).mode('lab').colors(6);
// const dataScale = chroma
// 	.scale([monoColor, '#888888', '#0099cc'])
// 	.mode('lab')
// 	.colors(6);
const dataScale = chroma.scale('Set1').colors(6);

export const lorenzobertoliniTheme: ThemeType = {
	global: {backgroundColor},
	typography: {
		title: {
			fontFamily: 'Inter-Bold',
			color: '#ffffff',
		},
		subTitle: {
			fontFamily: 'Inter-Medium',
			color: '#ffffff',
		},
		titleColor: '#fff',
		subTitleColor: '#fff',
		textColor: '#fff',
		logoColor: '#fff',
		textStyles: {
			h1: {
				// fontFamily: 'Inter-28pt-Thin' as const,
				// fontFamily: 'Inter-28pt-Thin' as const,
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 3,
				lineGapInBaselines: 1,
				color: 'magenta',
			},
			h2: {
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 2,
				lineGapInBaselines: 1,
				color: 'magenta',
			},
			h3: {
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 1.2,
				lineGapInBaselines: 1.5,
				color: '#fff',
			},
			body: {
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 1,
				lineGapInBaselines: 1,
				color: 'magenta',
			},
			datavizLabel: {
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 1,
				lineGapInBaselines: 1,
				color: 'magenta',
			},
			datavizValueLabel: {
				fontFamily: 'Inter-Bold',
				capHeightInBaselines: 1,
				lineGapInBaselines: 1,
				color: 'magenta',
			},
			datavizTickLabel: {
				fontFamily: 'Inter-Bold',
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
		borderColor: '#e0e0e0',
		// borderColor: '#ff0000',
		// backgroundColor: '#ffff00',
	},
	TypographicLayouts: {
		baselineGrid: {
			// lineColor: 'green',
			lineColor: '#666',
		},
		gridLayout: {
			lineColor: '#f05122',
			activeAreaFill: chroma('#f05122').alpha(0.35).css(),
		},
	},
	EconomistDataSource: {
		textColor: '#777',
	},
	TwoChangeBars: {
		barsColor: textColor,
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
