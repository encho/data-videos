import {z} from 'zod';
import {Sequence} from 'remotion';

import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {WaterfallTextEffect} from '../../../../acetti-typography/TextEffects/WaterfallTextEffect';
import {Position} from '../../../../acetti-ts-base/Position';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';

export const textAnimationsCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	kpiValue: z.number(),
	kpiValueFormatString: z.string(),
	kpiLabel: z.string(),
	fontSize: z.number(),
});

export const TextAnimationsComposition: React.FC<
	z.infer<typeof textAnimationsCompositionSchema>
> = ({themeEnum, kpiValue, kpiValueFormatString, kpiLabel, fontSize}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// TODO kpi section in theme!!!
	// const kpiColor = theme.typography.textColor;

	const textStyles = {
		fontSize: 80,
		fontWeight: 700,
		fontFamily: theme.typography.title.fontFamily,
		color: theme.typography.title.color,
	};

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
						<div
							style={{
								...textStyles,
							}}
						>
							<FadeInAndOutText>FadeInAndOutText</FadeInAndOutText>
						</div>
					</Sequence>
					<Sequence layout="none">
						<div
							style={{
								...textStyles,
							}}
						>
							<WaterfallTextEffect>WaterfallTextEffect</WaterfallTextEffect>
						</div>
					</Sequence>
				</div>
			</Position>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
