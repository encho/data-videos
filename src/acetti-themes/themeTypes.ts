import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

export const zodThemeType = z.object({
	global: z.object({
		backgroundColor: zColor(),
	}),
	typography: z.object({
		titleColor: zColor(),
		subTitleColor: zColor(),
		textColor: zColor(),
	}),
	yAxis: z.object({
		fontSize: z.number(),
		strokeWidth: z.number(),
		color: zColor(),
		tickColor: zColor(),
	}),
	xAxis: z.object({
		fontSize: z.number(),
		strokeWidth: z.number(),
		color: zColor(),
		tickColor: zColor(),
	}),
	candlesticks: z.object({
		up: z.object({
			bodyColor: zColor(),
			bodyStrokeColor: zColor(),
			lineColor: zColor(),
			strokeWidth: z.number(),
		}),
		down: z.object({
			bodyColor: zColor(),
			bodyStrokeColor: zColor(),
			lineColor: zColor(),
			strokeWidth: z.number(),
		}),
	}),
	dataColors: z.array(
		z.object({
			M3: zColor(),
			M2: zColor(),
			M1: zColor(),
			BASE: zColor(),
			P1: zColor(),
			P2: zColor(),
			P3: zColor(),
		})
	),
	minimap: z.object({
		lineColor: zColor(),
		areaColor: zColor(),
		areaOpacity: z.number(),
	}),
	highlightArea: z.object({
		backgroundColor: zColor(),
		backgroundOpacity: z.number(),
		borderColor: zColor(),
		textColor: zColor(),
	}),
});

export type ThemeType = z.infer<typeof zodThemeType>;