import {z} from 'zod';
import {useVideoConfig, Sequence, staticFile, Video} from 'remotion';

import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {BaselineGrid} from '../BaselineGrid/BaselineGrid';
import {DisplayGridRails} from '../../../../acetti-layout';
import {FadeInAndOutText} from '../../../../acetti-typography/TextEffects/FadeInAndOutText';
import {HtmlArea} from '../../../../acetti-layout';
// import {SlideTitle} from '../SlideTitle';
import {useChartLayout} from './useChartLayout';
import {getTextDimensionsFromTextStyle} from '../../../../acetti-typography/CapSizeTextNew';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {TypographyStyle} from '../TextStyles/TextStylesComposition';
// import {LorenzoBertoliniLogo}

export const swissPoster01CompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SwissPoster01Composition: React.FC<
	z.infer<typeof swissPoster01CompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps, width, height} = useVideoConfig();

	useFontFamiliesLoader(theme);

	// horizontal layout sizes
	const horizontalMarginInBaselines = 2;

	// vertical layout sizes
	const verticalMarginInBaselines = 1;
	const aboveTitleBaselines = 1;
	const titleUpperSegmentInBaselines = 2;
	const titleLowerSegmentInBaselines = 1;
	const videoLowerSegmentInBaselines = 10;
	const underTitleBaselines = 2;

	const amountOfBaselines =
		2 * verticalMarginInBaselines +
		titleUpperSegmentInBaselines +
		titleLowerSegmentInBaselines +
		videoLowerSegmentInBaselines +
		aboveTitleBaselines +
		underTitleBaselines;

	const baseline = height / amountOfBaselines;

	const titleInBaselines =
		titleUpperSegmentInBaselines + titleLowerSegmentInBaselines;

	const posterTitleText = 'ciao';
	// const posterTitleText = 'back';

	const textStyle_h1 = theme.typography.textStyles.h1;
	const textStyle_posterTitle = {
		...textStyle_h1,
		capHeightInBaselines: titleInBaselines,
	};

	const posterTitleDimensions = getTextDimensionsFromTextStyle({
		textStyle: textStyle_posterTitle,
		baseline,
		text: posterTitleText,
	});

	// TODO rename to useSwissPoster01Layout() or so
	const chartLayout = useChartLayout({
		width,
		height,
		baseline,
		horizontalMarginInBaselines: horizontalMarginInBaselines,
		// titleWidthInPixel: posterTitleDimensions.width * 1.1,
		titleWidthInPixel: posterTitleDimensions.width,
		titleUpperSegmentInBaselines,
		titleLowerSegmentInBaselines,
		videoLowerSegmentInBaselines,
		aboveTitleInBaselines: aboveTitleBaselines,
		belowTitleInBaselines: underTitleBaselines,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			{/* <SlideTitle theme={theme}>Swiss Poster 01</SlideTitle> */}
			<Sequence
				layout="none"
				// from={fps * 1}
			>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							width: width,
							height: height,
							position: 'relative',
						}}
					>
						{/* <DisplayGridRails {...chartLayout} stroke="magenta" />
						<BaselineGrid
							width={width}
							height={height}
							baseline={baseline}
							{...theme.TypographicLayouts.baselineGrid}
							strokeWidth={3}
						/> */}

						<HtmlArea area={chartLayout.areas.video}>
							<div
								style={{
									position: 'relative',
									width: chartLayout.areas.video.width,
									height: chartLayout.areas.video.height,
								}}
							>
								<div
									style={{
										borderRadius: 20,
										overflow: 'hidden',
										width: '100%',
										height: '100%',
										// opacity: 0.5,
									}}
								>
									<Video
										src="https://s3.eu-central-1.amazonaws.com/dataflics.com/quick-tests/Gen-2+2677769786%2C+zoom+into+dramatic+j%2C+lorenzobertolini_a_b%2C+M+5.mp4"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
										playbackRate={4 / 6}
									/>
								</div>
							</div>
						</HtmlArea>

						<HtmlArea area={chartLayout.areas.title}>
							<div
								style={{
									mixBlendMode: 'screen',
									display: 'flex',
									justifyContent: 'center',
									overflow: 'visible',
								}}
							>
								<TypographyStyle
									baseline={baseline}
									typographyStyle={textStyle_posterTitle}
									color={'white'}
								>
									<FadeInAndOutText>{posterTitleText}</FadeInAndOutText>
								</TypographyStyle>
							</div>
						</HtmlArea>
					</div>
				</div>
			</Sequence>

			<LorenzoBertoliniLogo2 theme={theme} color={'white'} />
		</div>
	);
};
