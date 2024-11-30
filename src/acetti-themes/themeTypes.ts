import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {zAvailableFontFamiliesEnum} from '../acetti-typography/fontMetricsLibrary';
import {
	zThemePalette_Data,
	zThemePalette_Typography,
	zTheme_sizes,
} from './makeThemeGenerator';

const zTextStyle = z.object({
	fontFamily: zAvailableFontFamiliesEnum,
	capHeightInBaselines: z.number(),
	lineGapInBaselines: z.number(),
	color: zColor(),
});

const zTheme_ibcsSizes = z.object({
	barChartItem: z.object({
		rows: z.object({
			barMarginTop: z.number(),
			barHeight: z.number(),
			barMarginBottom: z.number(),
		}),
		columns: z.object({
			labelMargin: z.number(),
			valueLabelMargin: z.number(),
		}),
	}),
});

export type Theme_IBCS_Sizes_BarChartItem = z.infer<typeof zTheme_ibcsSizes>;

export type ThemeTextStyle = z.infer<typeof zTextStyle>;

export const zodThemeType = z.object({
	ibcsSizes: zTheme_ibcsSizes,
	sizes: zTheme_sizes,
	data: zThemePalette_Data,
	global: z.object({
		backgroundColor: zColor(),
		platteColor: zColor(),
	}),
	typography: z.object({
		title: z.object({
			fontFamily: z.string(),
			color: zColor(),
		}),
		subTitle: z.object({
			fontFamily: z.string(),
			color: zColor(),
		}),
		titleColor: zColor(),
		subTitleColor: zColor(),
		textColor: zColor(),
		logoColor: zColor(),
		// palette.typography type
		colors: zThemePalette_Typography,
		textStyles: z.object({
			h1: zTextStyle,
			h2: zTextStyle,
			h3: zTextStyle,
			body: zTextStyle,
			datavizLabel: zTextStyle,
			datavizValueLabel: zTextStyle,
			datavizTickLabel: zTextStyle,
			datavizSecondaryTickLabel: zTextStyle,
			dataSource: zTextStyle,
		}),
	}),
	yAxis: z.object({
		fontSize: z.number(),
		strokeWidth: z.number(),
		color: zColor(),
		tickColor: zColor(),
		// tickSize: z.number(),
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
	positiveNegativeColors: z.object({
		positiveColor: zColor(),
		negativeColor: zColor(),
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
	// highlightArea: z.object({
	// 	backgroundColor: zColor(),
	// 	backgroundOpacity: z.number(),
	// 	borderColor: zColor(),
	// 	textColor: zColor(),
	// }),
	platte: z.object({
		backgroundColor: zColor(),
		borderColor: zColor(),
	}),
	EconomistDataSource: z.object({
		textColor: zColor(),
	}),
	TwoChangeBars: z.object({
		barsColor: zColor(),
	}),
	SimpleKPI: z.object({
		kpiColor: zColor(),
		labelColor: zColor(),
	}),
	TypographicLayouts: z.object({
		baselineGrid: z.object({
			lineColor: zColor(),
		}),
		gridLayout: z.object({
			lineColor: zColor(),
			activeAreaFill: zColor(),
		}),
	}),
	BarChart: z.object({
		barColors: z.object({
			subtle: z.string(),
		}),
	}),
	timeseriesComponents: z.object({
		percentageChangeArea: z.object({
			lineColor: zColor(),
			textColor: zColor(),
			gradientColor: zColor(),
			lineStrokeWidth: z.number(),
		}),
		HighlightPeriodsArea: z.object({
			backgroundColor: zColor(),
			backgroundOpacity: z.number(),
			borderColor: zColor(),
			textColor: zColor(),
		}),
	}),
});

export type ThemeType = z.infer<typeof zodThemeType>;
