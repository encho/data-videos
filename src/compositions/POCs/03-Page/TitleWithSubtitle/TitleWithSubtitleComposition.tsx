import {z} from 'zod';
import React from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {Page} from '../SimplePage/ThemePage';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {KeyFramesInspector} from './KeyframesInspector'; // TODO from acetti-keyframes or so
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
// import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {buildKeyFramesGroup, getKeyFramesInterpolator} from './keyframes';

export const titleWithSubtitleCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TitleWithSubtitleComposition: React.FC<
	z.infer<typeof titleWithSubtitleCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);
	const {height} = useVideoConfig();

	return (
		<Page theme={theme}>
			<div
				style={{
					width: 900,
					// height: 300,
					// padding: 50,
					backgroundColor: theme.global.platteColor,
					// overflow: 'visible',
					// overflow: 'visible',
					overflow: 'hidden',
					marginBottom: height / 20,
				}}
			>
				<TitleWithSubtitle theme={theme} title="Title" subtitle="Subtitle" />
			</div>
			<TitleWithSubtitleKeyframes theme={theme} />;
		</Page>
	);
};

export function useTitleWithSubtitleKeyframes() {
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		// the title...
		{type: 'SECOND', value: 0, id: 'TITLE_ENTER_START'},
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'TITLE_ENTER_END',
			relativeId: 'TITLE_ENTER_START',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'TITLE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: 'TITLE_EXIT_START',
			relativeId: 'TITLE_EXIT_END',
		},
		// the subtitle...
		{
			type: 'R_SECOND',
			value: 0.75,
			id: 'SUBTITLE_ENTER_START',
			relativeId: 'TITLE_ENTER_START',
		},
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'SUBTITLE_ENTER_END',
			relativeId: 'SUBTITLE_ENTER_START',
		},
		{
			type: 'FRAME',
			value: -0,
			id: 'SUBTITLE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: 'SUBTITLE_EXIT_START',
			relativeId: 'SUBTITLE_EXIT_END',
		},
	]);

	// TODO perhaps also return interpolators..
	return {keyframes};
}

export const TitleWithSubtitle: React.FC<{
	theme: ThemeType;
	title: string;
	subtitle: string;
	baseline?: number;
}> = ({theme, title, subtitle, baseline: baselineProp}) => {
	// const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const baseline = baselineProp || theme.page.baseline;

	const {keyframes: keyFramesGroup} = useTitleWithSubtitleKeyframes();

	const interpolateTitleOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[0, 1, 1, 0],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTitleFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[10, 0, 0, 10],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateTitleTranslateY = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[88, 0, 0, 88],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateSubtitleOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'SUBTITLE_ENTER_START',
			'SUBTITLE_ENTER_END',
			'SUBTITLE_EXIT_START',
			'SUBTITLE_EXIT_END',
		],
		[0, 1, 1, 0],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateSubtitleFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'SUBTITLE_ENTER_START',
			'SUBTITLE_ENTER_END',
			'SUBTITLE_EXIT_START',
			'SUBTITLE_EXIT_END',
		],
		[10, 0, 0, 10],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const interpolateSubtitleTranslateY = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'SUBTITLE_ENTER_START',
			'SUBTITLE_ENTER_END',
			'SUBTITLE_EXIT_START',
			'SUBTITLE_EXIT_END',
		],
		[88, 0, 0, 88],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const titleOpacity = interpolateTitleOpacity(frame);
	const titleFilterPixels = interpolateTitleFilterPixels(frame);
	const titleTranslateY = interpolateTitleTranslateY(frame);

	const subtitleOpacity = interpolateSubtitleOpacity(frame);
	const subtitleFilterPixels = interpolateSubtitleFilterPixels(frame);
	const subtitleTranslateY = interpolateSubtitleTranslateY(frame);

	// const titleZoom = interpolateTitleZoom(frame);
	// const subtitleZoom = interpolateSubtitleZoom(frame);

	return (
		<div>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h1}
				baseline={baseline}
				style={{
					opacity: titleOpacity,
					filter: `blur(${titleFilterPixels}px)`,
					transform: `translateY(${titleTranslateY}px)`,
				}}
				marginBottom={2}
			>
				{title}
			</TypographyStyle>

			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h2}
				baseline={baseline}
				style={{
					opacity: subtitleOpacity,
					filter: `blur(${subtitleFilterPixels}px)`,
					transform: `translateY(${subtitleTranslateY}px)`,
				}}
			>
				{subtitle}
			</TypographyStyle>
		</div>
	);
};

export const TitleWithSubtitleKeyframes: React.FC<{
	theme: ThemeType;
}> = ({theme}) => {
	const frame = useCurrentFrame();
	const {keyframes: keyFramesGroup} = useTitleWithSubtitleKeyframes();

	return (
		<KeyFramesInspector
			keyFramesGroup={keyFramesGroup}
			width={700}
			baseFontSize={18}
			frame={frame}
		/>
	);
};
