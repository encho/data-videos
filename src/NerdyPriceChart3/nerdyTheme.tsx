export const nerdyTheme = {
	global: {backgroundColor: '#ffffff'},
	yAxis: {
		fontSize: 15,
		strokeWidth: 4,
		color: '#ff6b6b',
		tickColor: '#ff6b6b',
	},
	xAxis: {
		fontSize: 16,
		strokeWidth: 2,
		color: '#ff6b6b',
		tickColor: '#ff6b6b',
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
			BASE: '#f05122',
			P1: '#666',
			P2: '#566',
			P3: '#444',
		},
		{
			M3: '#333',
			M2: '#555',
			M1: 'cyan',
			BASE: '#3f62ca',
			P1: 'magenta',
			P2: '#566',
			P3: '#444',
		},
	],
	minimap: {
		lineColor: '#ff7575',
		areaColor: '#ff0000',
		areaOpacity: 0.2,
	},
	highlightArea: {
		backgroundColor: '#c2bb00',
		backgroundOpacity: 0.2,
		borderColor: '#99b800',
		textColor: '#ff7214',
	},
};
