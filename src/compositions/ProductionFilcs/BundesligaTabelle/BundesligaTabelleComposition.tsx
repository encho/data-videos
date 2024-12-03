import {z} from 'zod';
import {useVideoConfig, Sequence} from 'remotion';
import {useMemo} from 'react';

import {getEnterKeyframes} from '../../POCs/NewBarCharts/DynamicList/packages/BarChartAnimation/BarsTransition/getKeyframes';
import {getImageLabelComponent} from '../../POCs/NewBarCharts/DynamicList/packages/BarChartAnimation/BarsTransition/getImageLabelComponent';
import {SimpleBarChart as SimpleBarChartNew} from '../../POCs/NewBarCharts/DynamicList/components/SimpleBarChart';
import {PageContext, usePage} from '../../../acetti-components/PageContext';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../../acetti-components/Page';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../POCs/03-Page/SimplePage/useElementDimensions';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {TBarChartItem} from '../../POCs/NewBarCharts/DynamicList/packages/BarChartAnimation/useBarChartTransition/useBarChartTransition';
import {TitleWithSubtitle} from '../../POCs/03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {TextAnimationSubtle} from '../../POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {ThemeType} from '../../../acetti-themes/themeTypes';
import {colorPalettes} from '../../../acetti-themes/tailwindPalettes';
import {LastLogoPage} from '../../POCs/03-Page/LastLogoPageContentDev/LastLogoPage';
import {StartingFiveSlide} from '../../POCs/01-TextEffects/StartingFiveSlide/StartingFiveSlide';

export const bundesligaTabelleCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
	dataSource: z.string(),
	data: z.array(
		z.object({
			label: z.string(),
			value: z.number(),
			id: z.string(),
			teamIconUrl: z.string(),
		})
	),
});

export type TBundesLigaTabelleCompositionSchema = z.infer<
	typeof bundesligaTabelleCompositionSchema
>;

export const BundesligaTabelleComposition: React.FC<
	z.infer<typeof bundesligaTabelleCompositionSchema>
> = ({themeEnum, data, title, subtitle, dataSource}) => {
	const {fps, durationInFrames, width, height} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum);

	const startingFiveSlideDurationInFrames = Math.floor(fps * 3.5);
	const whiteSpaceSlideDurationInFrames = Math.floor(fps * 0);
	const lastSlideDurationInFrames = Math.floor(fps * 2);

	const barChartDurationInFrames =
		durationInFrames -
		startingFiveSlideDurationInFrames -
		whiteSpaceSlideDurationInFrames -
		lastSlideDurationInFrames;

	const barChartFrom =
		startingFiveSlideDurationInFrames + whiteSpaceSlideDurationInFrames;
	const lastSlideFrom = barChartFrom + barChartDurationInFrames;

	const colors = {
		championsLeague: colorPalettes.Emerald[400],
		championsOrUefaLeague: colorPalettes.Emerald[500],
		uefaLeague: colorPalettes.Emerald[600],
		uefaConferenceLeague: colorPalettes.Emerald[700],
		relegation: colorPalettes.Rose[700],
		abstieg: colorPalettes.Rose[600],
		mittlerePosition: theme.data.grays[700],
	};

	const dataWithColors = data.map((it, i) => ({
		...it,
		color:
			i < 2
				? colors.championsLeague
				: i === 2
				? colors.championsOrUefaLeague
				: i === 3
				? colors.uefaLeague
				: i === 4
				? colors.uefaConferenceLeague
				: i === 15
				? colors.relegation
				: i > 15
				? colors.abstieg
				: colors.mittlerePosition,
	}));

	return (
		<PageContext
			width={width}
			height={height}
			margin={50}
			nrBaselines={70}
			theme={theme}
		>
			<Sequence
				layout="none"
				from={fps * 0}
				durationInFrames={startingFiveSlideDurationInFrames}
			>
				<StartingFiveSlide
					theme={theme}
					fontSizeInBaselines={5}
					lineHeightInBaselines={5.25}
					numberOfWordRows={17}
					word="BUNDESLIGA."
					video="FOOTBALL_FIELD"
				/>
			</Sequence>

			{/* This is to have 0.6 seconds of pause */}
			{/* <Sequence
				layout="none"
				from={startingFiveSlideDurationInFrames}
				durationInFrames={whiteSpaceSlideDurationInFrames}
			>
				<Page={theme}>
					<></>
				</Page>
			</Sequence> */}

			<Sequence
				layout="none"
				from={barChartFrom}
				durationInFrames={barChartDurationInFrames}
			>
				<BundesligaBarChartsPage
					theme={theme}
					data={dataWithColors}
					title={title}
					subtitle={subtitle}
					dataSource={dataSource}
				/>
			</Sequence>
			<Sequence layout="none" from={lastSlideFrom}>
				<LastLogoPage theme={theme} />
			</Sequence>
		</PageContext>
	);
};

export const BundesligaBarChartsPage: React.FC<{
	theme: ThemeType;
	data: Array<TBarChartItem & {teamIconUrl: string}>;
	title: string;
	subtitle: string;
	dataSource: string;
}> = ({theme, data, title, subtitle, dataSource}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	const keyframes = getEnterKeyframes({
		fps,
		durationInFrames,
		data,
	});

	const enterEndKeyframes = keyframes.keyFrames.filter((it) =>
		it.id.includes('BAR_ENTER_END')
	);
	const enterEndFrames = enterEndKeyframes.map((it) => it.frame);
	const lastEnterEndFrame = Math.max(...enterEndFrames);
	const lastEnterEndSecond = lastEnterEndFrame / fps;

	const barChartDelayInSeconds = 0.7;

	const page = usePage();

	return (
		<Page>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader>
					<TitleWithSubtitle
						title={title}
						subtitle={subtitle}
						theme={theme}
						innerDelayInSeconds={0.35}
					/>
				</PageHeader>

				<div
					ref={ref}
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{dimensions ? (
						<div
							style={{
								width: dimensions.width,
								height: dimensions.height,
								// backgroundColor: 'gray',
							}}
						>
							<Sequence
								from={Math.floor(fps * barChartDelayInSeconds)}
								layout="none"
							>
								<BarChartWithLogos
									theme={theme}
									width={dimensions.width}
									height={dimensions.height}
									data={data}
								/>
							</Sequence>
						</div>
					) : null}
				</div>

				{/* TODO introduce evtl. also absolute positioned footer */}
				<PageFooter>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<div style={{maxWidth: '62%'}}>
							<TypographyStyle
								typographyStyle={theme.typography.textStyles.dataSource}
								baseline={page.baseline}
							>
								<TextAnimationSubtle
									translateY={page.baseline * 1.1}
									innerDelayInSeconds={
										lastEnterEndSecond + barChartDelayInSeconds
									}
								>
									{dataSource}
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
			<PageLogo />
		</Page>
	);
};

export const BarChartWithLogos: React.FC<{
	theme: ThemeType;
	data: Array<TBarChartItem & {teamIconUrl: string}>;
	height: number;
	width: number;
}> = ({theme, data, width, height}) => {
	const imageMappings = useMemo(() => {
		const idImagePairs = data.map((it) => [it.id, it.teamIconUrl]);
		return Object.fromEntries(idImagePairs);
	}, [data]);

	const BundesligaTeamLabelComponent = useMemo(
		() =>
			getImageLabelComponent({
				imageMappings,
			}),
		[imageMappings]
	);

	return (
		<SimpleBarChartNew
			hideAxis
			dataItems={data}
			width={width}
			height={height}
			theme={theme}
			LabelComponent={BundesligaTeamLabelComponent}
			valueLabelFormatter={(value) =>
				value === 1 ? `${value} Punkt` : `${value} Punkte`
			}
		/>
	);
};
