import {z} from 'zod';
import numeral from 'numeral';
import {Sequence} from 'remotion';

import {FadeInAndOutText} from './FadeInAndOutText';
import {WaterfallTextEffect} from './WaterfallTextEffect';
import {ThemeType} from '../../acetti-themes/themeTypes';
import {Position} from '../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

export const simpleKPICompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	fontSize: z.number(),
});

export const SimpleKPIComposition: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, fontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// TODO kpi section in theme!!!
	// const kpiColor = theme.typography.textColor;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Position position={{top: 100, left: 100}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 80}}>
					<Sequence layout="none">
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue,
								kpiValueFormatString,
								kpiLabel,
								fontSize,
							}}
						/>
					</Sequence>

					<Sequence layout="none" from={90}>
						<SimpleKPI
							{...{
								themeEnum,
								kpiValue: 2000,
								kpiValueFormatString: '$ 0.00',
								kpiLabel: 'Investments',
								fontSize,
							}}
						/>
					</Sequence>
				</div>
			</Position>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

export const SimpleKPI: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, fontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const formattedKpiValue = numeral(kpiValue).format(kpiValueFormatString);

	// TODO kpi section in theme!!!
	// const kpiColor = theme.typography.textColor;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				fontSize,
			}}
		>
			{/* <Sequence from={90 * 0.75} layout="none"> */}
			<div
				style={{
					...getTitleStyles(theme),
					fontSize,
				}}
			>
				<FadeInAndOutText innerDelay={Math.floor(90 * 0.75)}>
					{formattedKpiValue}
				</FadeInAndOutText>
			</div>
			{/* </Sequence> */}
			<div
				style={{
					...getSubTitleStyles(theme),
					fontSize: `${0.62}em`,
					marginTop: `-${0.5}em`,
				}}
			>
				<WaterfallTextEffect>{kpiLabel}</WaterfallTextEffect>
			</div>
		</div>
	);
};

const getTitleStyles = (theme: ThemeType) => {
	const titleStyles = {
		fontWeight: 700,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.SimpleKPI.kpiColor,
	};
	return titleStyles;
};

const getSubTitleStyles = (theme: ThemeType) => {
	const subTitleStyles = {
		fontWeight: 500,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.SimpleKPI.labelColor,
	};
	return subTitleStyles;
};
