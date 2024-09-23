import {z} from 'zod';
// import numeral from 'numeral';
// import {Sequence} from 'remotion';

// import {FadeInAndOutText} from './FadeInAndOutText';
// import {WaterfallTextEffect} from './WaterfallTextEffect';
// import {ThemeType} from '../../acetti-themes/themeTypes';
// import {Position} from '../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

// import {
// 	getKPIFontSize,
// 	getLabelFontSize,
// 	getLabelMarginTop,
// 	getSpaceMedium,
// } from '../../acetti-themes/typographySizes';

export const circleToRectPathSchema = z.object({
	themeEnum: zThemeEnum,
	// kpiValue: z.number(),
	// kpiValueFormatString: z.string(),
	// kpiLabel: z.string(),
	// baseFontSize: z.number(),
});

export const CircleToRectPath: React.FC<
	z.infer<typeof circleToRectPathSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					color: theme.typography.title.color,
					fontSize: 100,
					marginBottom: 50,
				}}
			>
				Circle to Rect Path Animation POC
			</div>

			<svg style={{backgroundColor: 'cyan', width: 500, height: 500}}>
				<g />
			</svg>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
