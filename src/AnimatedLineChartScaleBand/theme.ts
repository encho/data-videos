import {TTheme_XAxis} from './components/AnimatedXAxis_MonthStarts';
import {TTheme_YAxis} from './components/AnimatedYAxis';
import {TTheme_Candlesticks} from './components/AnimatedCandlesticks';

type TTheme_Global = {
	backgroundColor: string;
};

export type TTheme = {
	global: TTheme_Global;
	yAxis: TTheme_YAxis;
	xAxis: TTheme_XAxis;
	candlesticks: TTheme_Candlesticks;
};

const Y_LABELS_FONTSIZE = 16;
// const Y_LABELS_FORMATTER = (x: number) => `${x} hehe`;

function Y_LABELS_FORMATTER(num: number): string {
	return num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export const myTheme: TTheme = {
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
