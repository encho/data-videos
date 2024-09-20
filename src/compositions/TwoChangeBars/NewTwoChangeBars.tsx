import {z} from 'zod';

// import {TwoChangeBars as TwoChangeBarsComponent} from '../../acetti-flics/TwoChangeBars/TwoChangeBars';
import {lorenzobertoliniTheme} from '../../acetti-themes/lorenzobertolini';
import {nerdyTheme} from '../../acetti-themes/nerdy';
import {TitleSlide} from './TitleSlide';
import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {lorenzobertolinibrightTheme} from '../../acetti-themes/lorenzobertolinibright';
import {Position} from '../../acetti-ts-base/Position';
import {NewTwoChangeBars as TwoChangeBarsComponent} from '../../acetti-flics/NewTwoChangeBars/NewTwoChangeBars';

export const twoChangeBarsComponentProps = z.object({
	themeEnum: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	leftBarValue: z.number(),
	leftBarLabel: z.string(),
	rightBarValue: z.number(),
	rightBarLabel: z.string(),
	valueFormatString: z.string(),
	percentageFormatString: z.string(),
	minDomainValue: z.number().optional(),
	maxDomainValue: z.number().optional(),
});

export const newTwoChangeBarsSchema = twoChangeBarsComponentProps.merge(
	z.object({
		title: z.string(),
		subTitle: z.string(),
	})
);

const CHART_AREA_WIDTH = 450;
const CHART_AREA_HEIGHT = 600;

export const NewTwoChangeBars: React.FC<
	z.infer<typeof newTwoChangeBarsSchema>
> = ({
	themeEnum,
	title,
	subTitle,
	leftBarValue,
	rightBarValue,
	leftBarLabel,
	rightBarLabel,
	valueFormatString,
	percentageFormatString,
	minDomainValue,
	maxDomainValue,
}) => {
	// TODO integrate into colorpalette
	const theme =
		themeEnum === 'NERDY'
			? nerdyTheme
			: themeEnum === 'LORENZOBERTOLINI'
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	const paddingHorizontal = 60;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<Position position={{top: paddingHorizontal, left: paddingHorizontal}}>
				<TitleSlide
					titleColor={theme.typography.titleColor}
					subTitleColor={theme.typography.subTitleColor}
					title={title}
					subTitle={subTitle}
					titleFontSize={70}
					subTitleFontSize={40}
				/>
			</Position>

			<Position
				position={{top: 300, left: (1080 - CHART_AREA_WIDTH) / 2}}
				backgroundColor="red"
			>
				<TwoChangeBarsComponent
					{...{
						themeEnum,
						CHART_AREA_HEIGHT,
						CHART_AREA_WIDTH,
						leftBarValue,
						rightBarValue,
						leftBarLabel,
						rightBarLabel,
						valueFormatString,
						percentageFormatString,
						minDomainValue,
						maxDomainValue,
					}}
				/>
			</Position>

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
