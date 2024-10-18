import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

import {getThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {Position} from '../../../../acetti-ts-base/Position';
import {NewTwoChangeBars as TwoChangeBarsComponent} from '../../../../acetti-flics/NewTwoChangeBars/NewTwoChangeBars';
import {EconomistTitleWithSubtitle} from '../../04-BarCharts/EconomistTitleWithSubtitle';
import {EconomistDataSource} from '../../04-BarCharts/EconomistDataSource';
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

const CHART_AREA_WIDTH = 450;
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

	const theme = getThemeFromEnum(themeEnum as any);

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
			<EconomistTitleWithSubtitle
				title={title}
				subtitle={subTitle}
				theme={theme}
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
								CHART_AREA_WIDTH,
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
