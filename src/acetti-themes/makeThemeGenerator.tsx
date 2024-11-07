// import chroma from 'chroma-js';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

import {ThemeType} from './themeTypes';
import {isVideoSize} from '../Root';
import {colorPalettes} from './tailwindPalettes';

export const zThemePalette_Background = z.object({
	main: zColor(),
	soft: zColor(),
});

export const zThemePalette_Data = z.object({
	grays: z.object({
		50: zColor(),
		100: zColor(),
		200: zColor(),
		300: zColor(),
		400: zColor(),
		500: zColor(),
		600: zColor(),
		700: zColor(),
		800: zColor(),
		900: zColor(),
		950: zColor(),
	}),
	tenColors: z.object({
		0: z.object({main: zColor()}),
		1: z.object({main: zColor()}),
		2: z.object({main: zColor()}),
		3: z.object({main: zColor()}),
		4: z.object({main: zColor()}),
		5: z.object({main: zColor()}),
		6: z.object({main: zColor()}),
		7: z.object({main: zColor()}),
		8: z.object({main: zColor()}),
		9: z.object({main: zColor()}),
	}),
});

export const zThemePalette_Typography = z.object({
	title: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	subtitle: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	dataSource: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	datavizLabel: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	datavizValueLabel: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	logo: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	axisTickLabel: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	axisTick: z.object({
		main: zColor(),
		soft: zColor(),
	}),
	axisLine: z.object({
		main: zColor(),
		soft: zColor(),
	}),
});

type ThemePalette_Background = z.infer<typeof zThemePalette_Background>;
type ThemePalette_Typography = z.infer<typeof zThemePalette_Typography>;
type ThemePalette_Data = z.infer<typeof zThemePalette_Data>;

export type ThemePalette = {
	background: ThemePalette_Background;
	typography: ThemePalette_Typography;
	data: ThemePalette_Data;
};

export function makeThemeGenerator({palette}: {palette: ThemePalette}) {
	const themeGenerator = ({
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
				backgroundColor: palette.background.main, // TODO deprecate take from palette
				platteColor: palette.background.soft,
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
				logoColor: palette.typography.logo.main,
				// TODO deprecate the colors above
				colors: palette.typography,
				textStyles: {
					h1: {
						fontFamily: 'Inter-28pt-Black',
						capHeightInBaselines: 3,
						lineGapInBaselines: 1.75,
						color: palette.typography.title.main,
					},
					h2: {
						fontFamily: 'Inter-Regular',
						capHeightInBaselines: 2,
						lineGapInBaselines: 1.5,
						color: palette.typography.subtitle.main,
					},
					h3: {
						fontFamily: 'Inter-Bold',
						capHeightInBaselines: 1.5,
						lineGapInBaselines: 1.5,
						color: '#fff',
					},
					body: {
						fontFamily: 'Inter-Regular',
						capHeightInBaselines: 1,
						lineGapInBaselines: 0.5,
						color: '#fff',
					},
					datavizLabel: {
						fontFamily: 'Inter-Regular',
						capHeightInBaselines: 1,
						lineGapInBaselines: 1,
						color: palette.typography.datavizLabel.main,
					},
					datavizValueLabel: {
						fontFamily: 'Inter-Bold',
						capHeightInBaselines: 0.85,
						lineGapInBaselines: 1,
						color: palette.typography.datavizValueLabel.main,
					},
					datavizTickLabel: {
						fontFamily: 'Inter-Regular',
						capHeightInBaselines: 0.8,
						lineGapInBaselines: 1,
						color: palette.typography.axisTickLabel.main,
					},
					dataSource: {
						fontFamily: 'Inter-Regular',
						capHeightInBaselines: 1,
						lineGapInBaselines: 0.75,
						color: palette.typography.dataSource.main,
					},
				},
			},
			yAxis: {
				fontSize: 16,
				strokeWidth: 3,
				color: palette.typography.axisLine.main,
				tickColor: palette.typography.axisTick.main,
			},
			xAxis: {
				fontSize: 16,
				strokeWidth: 3,
				color: palette.typography.axisLine.main,
				tickColor: palette.typography.axisTick.main,
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
			data: palette.data,
			// TODO deprecate
			dataColors: [
				{
					M3: '#333',
					M2: '#555',
					M1: '#ff0000',
					BASE: 'magenta',
					P1: '#666',
					P2: '#566',
					P3: '#444',
				},
				{
					M3: '#333',
					M2: '#555',
					M1: 'cyan',
					BASE: 'magenta',
					P1: 'magenta',
					P2: '#566',
					P3: '#444',
				},
				{
					M3: '#333',
					M2: '#555',
					M1: 'cyan',
					BASE: 'magenta',
					P1: 'magenta',
					P2: '#566',
					P3: '#444',
				},
				{
					M3: '#333',
					M2: '#555',
					M1: 'cyan',
					BASE: 'magenta',
					P1: 'magenta',
					P2: '#566',
					P3: '#444',
				},
				{
					M3: '#333',
					M2: '#555',
					M1: 'cyan',
					BASE: 'magenta',
					P1: 'magenta',
					P2: '#566',
					P3: '#444',
				},
				{
					M3: '#333',
					M2: '#555',
					M1: 'cyan',
					BASE: 'magenta',
					P1: 'magenta',
					P2: '#566',
					P3: '#444',
				},
			],
			BarChart: {
				barColors: {
					subtle: 'magenta',
				},
			},
			minimap: {
				lineColor: 'magenta',
				areaColor: 'cyan',
				areaOpacity: 0.2,
			},
			platte: {
				backgroundColor: 'magenta',
				borderColor: 'cyan',
			},
			TypographicLayouts: {
				baselineGrid: {
					lineColor: 'magenta',
				},
				gridLayout: {
					lineColor: '#f05122',
					activeAreaFill: 'cyan',
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
					backgroundColor: 'magenta',
					backgroundOpacity: 0.4,
					borderColor: 'cyan',
					textColor: 'cyan',
				},
				// TODO: bring highlightArea here!! and rename to HighlightPeriodsArea
			},
		};
	};

	return themeGenerator;
}
