import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {Position} from '../../../../acetti-layout/atoms/Position';
import {NewTwoChangeBars as TwoChangeBarsComponent} from '../../../../acetti-flics/NewTwoChangeBars/NewTwoChangeBars';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {EconomistDataSource} from '../../05-BarCharts/EconomistDataSource';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';

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

export const twoChangeBarsCompositionSchema = twoChangeBarsComponentProps.merge(
	z.object({
		title: z.string(),
		subTitle: z.string(),
	})
);

const CHART_AREA_HEIGHT = 600;

export const TwoChangeBarsComposition: React.FC<
	z.infer<typeof twoChangeBarsCompositionSchema>
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
	const {durationInFrames} = useVideoConfig();

	const theme = useThemeFromEnum(themeEnum);

	const baseline = 40;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<TitleWithSubtitle
				title={title}
				subtitle={subTitle}
				theme={theme}
				baseline={20}
			/>

			<Sequence from={90 * 1} durationInFrames={durationInFrames - 90 * 2}>
				<Position
					position={{
						top: 300,
					}}
					backgroundColor="red"
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: 1080,
							position: 'relative',
						}}
					>
						<TwoChangeBarsComponent
							{...{
								theme,
								CHART_AREA_HEIGHT,
								leftBarValue,
								rightBarValue,
								leftBarLabel,
								rightBarLabel,
								valueFormatString,
								percentageFormatString,
								minDomainValue,
								maxDomainValue,
								baseline,
							}}
						/>
					</div>
				</Position>
			</Sequence>

			<EconomistDataSource theme={theme}>
				AirVisual World Air Quality Report 2018
			</EconomistDataSource>

			<LorenzoBertoliniLogo2 theme={theme} />
		</div>
	);
};
