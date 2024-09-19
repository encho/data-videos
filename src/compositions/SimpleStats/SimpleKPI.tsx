import {z} from 'zod';
import numeral from 'numeral';
import {measureText} from '@remotion/layout-utils';

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

	const formattedKpiValue = numeral(kpiValue).format(kpiValueFormatString);

	const kpiFontProps = {
		fontSize,
		fontWeight: 700,
		fontFamily: 'Arial',
	};

	const kpiTextWidth = measureText({
		text: formattedKpiValue,
		...kpiFontProps,
	});

	const kpiColor = theme.typography.textColor;

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
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						fontSize: kpiFontProps.fontSize,
					}}
				>
					<div
						style={{
							...kpiFontProps,
							color: kpiColor,
						}}
					>
						<CharacterWrapper>{formattedKpiValue}</CharacterWrapper>
					</div>
					<div
						style={{
							width: kpiTextWidth.width,
							height: `${0.05}em`,
							backgroundColor: kpiColor,
							marginTop: -15,
						}}
					></div>
					<div
						style={{
							color: kpiColor,
							...kpiFontProps,
							fontSize: `${0.62}em`,
							fontWeight: 500,
							marginTop: 10,
						}}
					>
						{kpiLabel}
					</div>
				</div>
			</Position>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};

type Props = {
	children: string;
	tag?: keyof JSX.IntrinsicElements;
};

const CharacterWrapper: React.FC<Props> = ({children, tag: Tag = 'span'}) => {
	return (
		<>
			{children.split('').map((char, index) => (
				<Tag key={index}>{char}</Tag>
			))}
		</>
	);
};
