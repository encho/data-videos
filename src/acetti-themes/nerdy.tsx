import chroma from 'chroma-js';

import {ThemeType} from './themeTypes';

const textColor = chroma('#888').hex();
const backgroundColor = chroma('#222222').darken().hex();

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

export const nerdyTheme: ThemeType = {
	global: {backgroundColor},
	typography: {
		titleColor: '#ffffff',
		subTitleColor: '#888',
		textColor: '#ffffff',
		logoColor: '#ffffff',
	},
	yAxis: {
		fontSize: 16,
		strokeWidth: 3,
		color: textColor,
		tickColor: textColor,
	},
	xAxis: {
		fontSize: 16,
		strokeWidth: 3,
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
		backgroundColor: platteBackground,
		borderColor: platteBorder,
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
