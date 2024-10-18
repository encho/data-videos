import {z} from 'zod';
import {useVideoConfig, Img, staticFile, Sequence} from 'remotion';

import {lorenzobertoliniTheme} from '../../../../acetti-themes/lorenzobertolini';
import {lorenzobertolinibrightTheme} from '../../../../acetti-themes/lorenzobertolinibright';
import {nerdyTheme} from '../../../../acetti-themes/nerdy';
import {TitleSlide} from './TitleSlide';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {Position} from '../../../../acetti-ts-base/Position';
import {NewTwoChangeBars as TwoChangeBarsComponent} from '../../../../acetti-flics/NewTwoChangeBars/NewTwoChangeBars';

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

export const twoChangeBarsWithImageCompositionSchema =
	twoChangeBarsComponentProps.merge(
		z.object({
			title: z.string(),
			subTitle: z.string(),
		})
	);

// const CHART_AREA_WIDTH = 500;
const CHART_AREA_HEIGHT = 500;

export const TwoChangeBarsWithImageComposition: React.FC<
	z.infer<typeof twoChangeBarsWithImageCompositionSchema>
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
	maxDomainValue,
	minDomainValue,
}) => {
	const {width, height, fps, durationInFrames} = useVideoConfig();

	// TODO integrate into colorpalette
	// const theme = themeEnum === 'NERDY' ? nerdyTheme : lorenzobertoliniTheme;
	const theme =
		themeEnum === 'NERDY'
			? nerdyTheme
			: themeEnum === 'LORENZOBERTOLINI'
			? lorenzobertoliniTheme
			: lorenzobertolinibrightTheme;

	const paddingHorizontal = 60;

	const leftPanelWidth = width / 2;
	const rightPanelWidth = width / 2;

	return (
		<div style={{display: 'flex'}}>
			<div
				style={{
					backgroundColor: theme.global.backgroundColor,
					width: leftPanelWidth,
					height,
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

				<Sequence from={90 * 1} durationInFrames={durationInFrames - 90 * 2}>
					<Position
						position={{
							top: 360,
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								width: width / 2,
								position: 'relative',
							}}
						>
							<TwoChangeBarsComponent
								{...{
									themeEnum,
									CHART_AREA_HEIGHT,
									leftBarValue,
									rightBarValue,
									leftBarLabel,
									rightBarLabel,
									valueFormatString,
									percentageFormatString,
									minDomainValue,
									maxDomainValue,
									baseFontSize: 34,
								}}
							/>
						</div>
					</Position>
				</Sequence>
			</div>
			<div style={{width: rightPanelWidth, height}}>
				<Img
					// src="https://cdn.midjourney.com/c1307769-20ee-48b9-b9bc-604e5f9cc88f/0_1.png"
					// src="https://cdn.midjourney.com/8e68fbac-051a-4c1d-9e26-77f775747d8f/0_0.png"
					src={staticFile('nocheckin/cars-01.png')}
					width="100%"
					crossOrigin="anonymous"
				/>

				<LorenzoBertoliniLogo color={theme.typography.logoColor} />
			</div>
		</div>
	);
};
