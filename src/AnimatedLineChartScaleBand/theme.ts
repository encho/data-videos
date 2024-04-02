import {TTheme_XAxis} from './components/AnimatedXAxis_MonthStarts';
import {TTheme_YAxis} from './components/AnimatedYAxis';
import {TTheme_Candlesticks} from './components/AnimatedCandlesticks';
import {TTheme_Minimap} from './MinimapContainer';
import {TTheme_HighlightArea} from './components/HighlightPeriods2';

type TTheme_Global = {
	backgroundColor: string;
};

type TTheme_DataColors_DataColor = {
	M3: string;
	M2: string;
	M1: string;
	BASE: string;
	P1: string;
	P2: string;
	P3: string;
};

export type TTheme_DataColors = TTheme_DataColors_DataColor[];

const createDataColor = (baseColor: string) => {
	return {
		M3: baseColor,
		M2: baseColor,
		M1: baseColor,
		BASE: baseColor,
		P1: baseColor,
		P2: baseColor,
		P3: baseColor,
	};
};

export type TTheme = {
	global: TTheme_Global;
	yAxis: TTheme_YAxis;
	xAxis: TTheme_XAxis;
	candlesticks: TTheme_Candlesticks;
	dataColors: TTheme_DataColors;
	minimap: TTheme_Minimap;
	highlightArea: TTheme_HighlightArea;
};

const Y_LABELS_FONTSIZE = 16;
// const Y_LABELS_FORMATTER = (x: number) => `${x} hehe`;

function Y_LABELS_FORMATTER(num: number): string {
	return num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

const dataColors = [
	createDataColor('#f05122'),
	createDataColor('#00aacc'),
	createDataColor('#00ccaa'),
];

export const myTheme: TTheme = {
	highlightArea: {
		backgroundColor: dataColors[2].BASE,
		backgroundOpacity: 0.2,
		borderColor: dataColors[2].BASE,
		textColor: dataColors[2].BASE,
	},
	minimap: {
		lineColor: 'white',
		areaColor: 'white',
		areaOpacity: 0.2,
	},
	dataColors,
	global: {
		backgroundColor: '#101010',
	},
	yAxis: {
		fontSize: Y_LABELS_FONTSIZE,
		formatter: Y_LABELS_FORMATTER,
		strokeWidth: 3,
		color: '#fff',
		tickColor: '#fff',
	},
	xAxis: {
		fontSize: Y_LABELS_FONTSIZE,
		strokeWidth: 3,
		color: '#fff',
		tickColor: '#fff',
	},
	candlesticks: {
		up: {
			bodyColor: 'white',
			bodyStrokeColor: 'white',
			lineColor: 'white',
			strokeWidth: 1,
		},
		down: {
			bodyColor: 'black',
			bodyStrokeColor: 'white',
			lineColor: 'white',
			strokeWidth: 1,
		},
	},
};
