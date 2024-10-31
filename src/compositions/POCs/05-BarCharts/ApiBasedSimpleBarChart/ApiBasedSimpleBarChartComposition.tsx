import {z} from 'zod';
import {useVideoConfig, Img, Sequence} from 'remotion';
import chroma from 'chroma-js';

import {useBarChartKeyframes} from '../../../../acetti-flics/SimpleBarChart/useBarChartKeyframes';
import {
	Page,
	PageHeader,
	PageFooter,
	PageLogo,
} from '../../03-Page/SimplePage/ThemePage';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {useElementDimensions} from '../../03-Page/SimplePage/useElementDimensions';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {
	SimpleBarChart,
	TSimpleBarChartDataItem,
	TSimpleBarChartData,
} from '../../../../acetti-flics/SimpleBarChart/SimpleBarChart';
import {TitleWithSubtitle} from '../../03-Page/TitleWithSubtitle/TitleWithSubtitle';
import {zColor} from '@remotion/zod-types';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {getBarChartBaseline} from '../../../../acetti-flics/SimpleBarChart/useBarChartLayout';
import invariant from 'tiny-invariant';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {colorPalettes} from '../../../../acetti-themes/tailwindPalettes';
import {LastLogoPage} from '../../03-Page/LastLogoPageContentDev/LastLogoPage';

export const apiBasedSimpleBarChartCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	title: z.string(),
	subtitle: z.string(),
	dataSource: z.string(),
	data: z.array(
		z.object({
			label: z.string(),
			value: z.number(),
			barColor: zColor(),
			id: z.string(),
			valueLabel: z.string(),
			teamIconUrl: z.string(),
		})
	),
});

export const ApiBasedSimpleBarChartComposition: React.FC<
	z.infer<typeof apiBasedSimpleBarChartCompositionSchema>
> = ({themeEnum, data, title, subtitle, dataSource}) => {
	const {
		fps,
		// durationInFrames
	} = useVideoConfig();
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<div>
			<Sequence layout="none" from={0} durationInFrames={fps * 20}>
				<BundesligaBarChartsPage
					theme={theme}
					data={data}
					title={title}
					subtitle={subtitle}
					dataSource={dataSource}
				/>
			</Sequence>
			<Sequence layout="none" from={fps * 20} durationInFrames={fps * 4}>
				<LastLogoPage theme={theme} />
			</Sequence>
		</div>
	);
};

export const BundesligaBarChartsPage: React.FC<{
	theme: ThemeType;
	data: Array<TSimpleBarChartDataItem & {teamIconUrl: string}>;
	title: string;
	subtitle: string;
	dataSource: string;
}> = ({theme, data, title, subtitle, dataSource}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const {ref, dimensions} = useElementDimensions();

	const keyframes = useBarChartKeyframes({
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

	return (
		<Page theme={theme}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					position: 'relative',
				}}
			>
				<PageHeader
					theme={theme}
					// showArea={showAreas}
				>
					<TitleWithSubtitle title={title} subtitle={subtitle} theme={theme} />
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
						<div>
							<Sequence from={0} durationInFrames={fps * 10} layout="none">
								<BarChartWithLogos
									theme={theme}
									width={dimensions.width}
									height={dimensions.height}
									data={data}
								/>
							</Sequence>
							<Sequence
								from={fps * 10}
								durationInFrames={fps * 10}
								layout="none"
							>
								<BarChartWithDualColors
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
				<PageFooter theme={theme}>
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
								baseline={theme.page.baseline}
							>
								<TextAnimationSubtle
									translateY={theme.page.baseline * 1.1}
									innerDelayInSeconds={lastEnterEndSecond}
								>
									{dataSource}
								</TextAnimationSubtle>
							</TypographyStyle>
						</div>
					</div>
				</PageFooter>
			</div>
			<PageLogo theme={theme} />
		</Page>
	);
};

export const BarChartWithDualColors: React.FC<{
	theme: ThemeType;
	data: TSimpleBarChartData;
	height: number;
	width: number;
}> = ({theme, data: dataProp, width, height}) => {
	const barChartBaseline = getBarChartBaseline(height, dataProp);

	const maxPoints = Math.max(...dataProp.map((it) => it.value));
	const minPoints = Math.min(...dataProp.map((it) => it.value));

	const colorScale = chroma
		.scale(['#CC2B52', '#00aadd'])
		.mode('lab') // Use CIE Lab color space for perceptual uniformity
		.domain([minPoints, maxPoints]); // Map input numbers from 1 to 20

	const data = dataProp.map((it, i) => ({
		...it,
		barColor: colorScale(it.value).hex(),
	}));

	return (
		<SimpleBarChart
			data={data}
			width={width}
			baseline={barChartBaseline}
			theme={theme}
			// keyframes={keyframes} // TODO evtl. pass from above
		/>
	);
};

// TODO adjusted BasrChartDataItem
export const BarChartWithLogos: React.FC<{
	theme: ThemeType;
	data: Array<TSimpleBarChartDataItem & {teamIconUrl: string}>;
	height: number;
	width: number;
}> = ({theme, data: dataProp, width, height}) => {
	const barChartBaseline = getBarChartBaseline(height, dataProp);

	const colors = {
		championsLeague: colorPalettes.Emerald[400],
		championsOrUefaLeague: colorPalettes.Emerald[500],
		uefaLeague: colorPalettes.Emerald[600],
		uefaConferenceLeague: colorPalettes.Emerald[700],
		relegation: colorPalettes.Rose[700],
		abstieg: colorPalettes.Rose[600],
		mittlerePosition: colorPalettes['Slate'][600],
	};

	const data = dataProp.map((it, i) => ({
		...it,
		barColor:
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

	// TODO useCallback
	const CustomBarChartLabelComponent = ({
		children,
		id,
	}: {
		children: string;
		id: string;
	}) => {
		const imageSrc = data.find((it) => it.id === id)?.teamIconUrl;
		invariant(imageSrc);

		return (
			<div
				style={{
					display: 'flex',
					gap: barChartBaseline * 0.6,
					alignItems: 'center',
				}}
			>
				<TypographyStyle
					typographyStyle={theme.typography.textStyles.datavizLabel}
					baseline={barChartBaseline}
				>
					<TextAnimationSubtle
						innerDelayInSeconds={0}
						translateY={barChartBaseline * 1.15}
					>
						{children}
					</TextAnimationSubtle>
				</TypographyStyle>

				<TextAnimationSubtle
					innerDelayInSeconds={0}
					translateY={barChartBaseline * 1.15}
				>
					<Img
						style={{
							borderRadius: '50%',
							width: barChartBaseline * 2,
							height: barChartBaseline * 2,
						}}
						src={imageSrc}
					/>
				</TextAnimationSubtle>
			</div>
		);
	};

	return (
		<SimpleBarChart
			data={data}
			width={width}
			baseline={barChartBaseline}
			theme={theme}
			// keyframes={keyframes} // TODO evtl. pass from above
			CustomLabelComponent={CustomBarChartLabelComponent}
		/>
	);
};
