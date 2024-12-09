import {
	useVideoConfig,
	Sequence,
	// Video,
	Img,
	useCurrentFrame,
	interpolate,
	Easing,
	AbsoluteFill,
} from 'remotion';
import {z} from 'zod';
import invariant from 'tiny-invariant';

import {TextAnimationSubtle} from '../../POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {TypographyStyle} from '../../POCs/02-TypographicLayouts/TextStyles/TextStylesComposition';
import {PerformanceChartPage} from './PerformanceChartPage';
import {PageContext} from '../../../acetti-components/PageContext';
import {zNerdyFinancePriceChartDataResult} from '../../../acetti-http/nerdy-finance/fetchPriceChartData';
import {
	zNerdyTickers,
	zNerdyTimePeriod,
} from '../../../acetti-http/zNerdyTickers';
import {useThemeFromEnum} from '../../../acetti-themes/getThemeFromEnum';
import {GlobalVideoContextWrapper} from '../../../acetti-components/GlobalVideoContext';
import {LastLogoPage} from '../../POCs/03-Page/LastLogoPageContentDev/LastLogoPage';
import {BringForwardCenterTile} from '../../POCs/3D-Experiments/BrintForwardCenterTile/BringForwardCenterTile';
import {PageLogo, PageFooter, Page} from '../../../acetti-components/Page';

// const videoSources = {
// 	SHAPES:
// 		'https://s3.eu-central-1.amazonaws.com/dataflics.com/videos/5%3A3/Gen-3+Alpha+2885480945%2C+Moving+in+3d+space+%2C+lorenzobertolini_a_b%2C+M+5.mp4',
// 	SYNTHWAVE:
// 		'https://s3.eu-central-1.amazonaws.com/dataflics.com/videos/5%3A3/Gen-3+Alpha+2619336846%2C+Moving+in+3d+space+%2C+lorenzobertolini_an_%2C+M+5.mp4',
// };

const imageSources = {
	SYNTHWAVE:
		'https://s3.eu-central-1.amazonaws.com/dataflics.com/midjourney-images/5%3A3/lorenzobertolini_an_gradient_background_with_synthwave_colors_85e9f31d-9a90-472d-9b5d-85b262dc8ac6_0.png',
};

export const schema = z.object({
	tickerLeft: zNerdyTickers,
	tickerCenter: zNerdyTickers,
	tickerRight: zNerdyTickers,
	timePeriod: zNerdyTimePeriod,
	nerdyFinanceEnv: z.enum(['DEV', 'STAGE', 'PROD']),
	theme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	chartTheme: z.enum(['NERDY', 'LORENZOBERTOLINI', 'LORENZOBERTOLINI_BRIGHT']),
	apiPriceDataLeft: zNerdyFinancePriceChartDataResult.optional(),
	apiPriceDataCenter: zNerdyFinancePriceChartDataResult.optional(),
	apiPriceDataRight: zNerdyFinancePriceChartDataResult.optional(),
});

export type Schema = z.infer<typeof schema>;

export const Composition: React.FC<z.infer<typeof schema>> = ({
	theme: themeEnum,
	chartTheme: chartThemeEnum,
	apiPriceDataLeft,
	apiPriceDataCenter,
	apiPriceDataRight,
}) => {
	const theme = useThemeFromEnum(themeEnum);
	const {fps, durationInFrames, width, height} = useVideoConfig();

	const chartTheme = useThemeFromEnum(chartThemeEnum);

	const lastSlideDurationInFrames = Math.floor(fps * 2);
	const performanceChartDurationInFrames =
		durationInFrames - lastSlideDurationInFrames;

	invariant(apiPriceDataLeft);
	invariant(apiPriceDataCenter);
	invariant(apiPriceDataRight);

	// const videoSrc = videoSources.SYNTHWAVE;
	// const videoSrc = videoSources.SHAPES;

	const lineColorLeft = '#FF736B';
	const lineColorCenter = '#FF1A8E';
	const lineColorRight = '#146CA2';

	return (
		<GlobalVideoContextWrapper>
			<Sequence
				layout="none"
				from={fps * 0}
				durationInFrames={performanceChartDurationInFrames}
			>
				<div
					style={{
						width,
						height,
						backgroundColor: theme.global.backgroundColor,
						position: 'relative',
					}}
				>
					{/* <VideoBackground src={videoSrc} /> */}
					<ImageBackground src={imageSources.SYNTHWAVE} />

					<BringForwardCenterTile
						leftTile={() => {
							return (
								<PageContext
									width={width}
									height={height}
									margin={60}
									nrBaselines={60}
									theme={chartTheme}
								>
									<PerformanceChartPage
										apiPriceData={apiPriceDataLeft}
										lineColor={lineColorLeft}
									/>
								</PageContext>
							);
						}}
						centerTile={() => {
							return (
								<PageContext
									width={width}
									height={height}
									margin={60}
									nrBaselines={60}
									theme={chartTheme}
								>
									<PerformanceChartPage
										apiPriceData={apiPriceDataCenter}
										lineColor={lineColorCenter}
									/>
								</PageContext>
							);
						}}
						rightTile={() => {
							return (
								<PageContext
									width={width}
									height={height}
									margin={60}
									nrBaselines={60}
									theme={chartTheme}
								>
									<PerformanceChartPage
										apiPriceData={apiPriceDataRight}
										lineColor={lineColorRight}
									/>
								</PageContext>
							);
						}}
					/>
				</div>

				<div style={{position: 'absolute'}}>
					<PageContext
						width={width}
						height={height}
						margin={60}
						nrBaselines={60}
						theme={theme}
					>
						<Page backgroundColor="transparent">
							{({theme}) => {
								return (
									<>
										<div
											style={{
												display: 'flex',
												width: '100%',
												height: '100%',
												alignItems: 'end',
											}}
										>
											<PageFooter>
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'flex-end',
														width: '100%',
													}}
												>
													<div
														style={{
															width: '100%',
															display: 'flex',
															flexDirection: 'column',
															gap: 10,
														}}
													>
														<TypographyStyle
															typographyStyle={
																theme.typography.textStyles.dataSource
															}
														>
															<TextAnimationSubtle innerDelayInSeconds={0.5}>
																Data source: Yahoo Finance API, own
																calculations.
															</TextAnimationSubtle>
														</TypographyStyle>
														{/* <TypographyStyle
															typographyStyle={
																theme.typography.textStyles.dataSource
															}
														>
															<TextAnimationSubtle innerDelayInSeconds={0.5}>
																Background image generation: Midjourney ML.
															</TextAnimationSubtle>
														</TypographyStyle> */}
														{/* <TypographyStyle
															typographyStyle={
																theme.typography.textStyles.dataSource
															}
														>
															<TextAnimationSubtle innerDelayInSeconds={0.5}>
																Video production: Remotion.js, d3.js, React.
															</TextAnimationSubtle>
														</TypographyStyle> */}
														<TypographyStyle
															typographyStyle={
																theme.typography.textStyles.dataSource
															}
														>
															<TextAnimationSubtle innerDelayInSeconds={0.5}>
																© Lorenzo Bertolini
															</TextAnimationSubtle>
														</TypographyStyle>
													</div>
												</div>
											</PageFooter>
										</div>
										<PageLogo />
									</>
								);
							}}
						</Page>
					</PageContext>
				</div>
			</Sequence>
			<Sequence layout="none" from={performanceChartDurationInFrames}>
				<PageContext
					width={width}
					height={height}
					margin={60}
					nrBaselines={60}
					theme={theme}
				>
					<LastLogoPage theme={theme} />
				</PageContext>
			</Sequence>
		</GlobalVideoContextWrapper>
	);
};

// const VideoBackground = ({src}: {src: string}) => {
// 	const frame = useCurrentFrame();
// 	const {fps, durationInFrames} = useVideoConfig();

// 	const opacity = interpolate(
// 		frame,
// 		[durationInFrames - Math.floor(fps * 1.5), durationInFrames - 1],
// 		[1, 0],
// 		{
// 			extrapolateLeft: 'clamp',
// 			extrapolateRight: 'clamp',
// 			easing: Easing.ease,
// 		}
// 	);

// 	return (
// 		<AbsoluteFill>
// 			<Video
// 				src={src}
// 				style={{
// 					opacity,
// 					width: '100%',
// 					height: '100%',
// 					objectFit: 'cover',
// 				}}
// 			/>
// 		</AbsoluteFill>
// 	);
// };

const ImageBackground = ({src}: {src: string}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const opacity = interpolate(
		frame,
		[durationInFrames - Math.floor(fps * 1.5), durationInFrames - 1],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.ease,
		}
	);

	return (
		<AbsoluteFill>
			<Img
				src={src}
				style={{
					opacity,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
			/>
		</AbsoluteFill>
	);
};
