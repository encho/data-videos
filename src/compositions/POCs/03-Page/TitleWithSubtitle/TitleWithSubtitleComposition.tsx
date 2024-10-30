import {z} from 'zod';
import React from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {Page} from '../SimplePage/ThemePage';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {KeyFramesInspector} from './KeyframesInspector'; // TODO from acetti-keyframes or so
import {LorenzoBertoliniLogo2} from '../../../../acetti-components/LorenzoBertoliniLogo2';
import {
	useThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {buildKeyFramesGroup, getKeyFramesInterpolator} from './keyframes';

export const titleWithSubtitleCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const TitleWithSubtitleComposition: React.FC<
	z.infer<typeof titleWithSubtitleCompositionSchema>
> = ({themeEnum}) => {
	const theme = useThemeFromEnum(themeEnum as any);

	return (
		<Page theme={theme}>
			<SlideTitle theme={theme}>Keyframe-Transitions</SlideTitle>
			<TitleWithSubtitle theme={theme} title="Title" subtitle="Subtitle" />;
			<TitleWithSubtitleKeyframes theme={theme} />;
		</Page>
	);
};

export function useTitleWithSubtitleKeyframes() {
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		// the title...
		{type: 'SECOND', value: 1, id: 'TITLE_ENTER_START'},
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
}> = ({theme, title, subtitle}) => {
	// const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const {keyframes: keyFramesGroup} = useTitleWithSubtitleKeyframes();

	const width = 600;
	const height = 600;

	const interpolateTitleOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[0, 1, 1, 0],
		[Easing.bounce, Easing.bounce, Easing.bounce]
	);

	const interpolateTitleZoom = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'TITLE_ENTER_START',
			'TITLE_ENTER_END',
			'TITLE_EXIT_START',
			'TITLE_EXIT_END',
		],
		[10, 1, 1, 20],
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
		[Easing.bounce, Easing.bounce, Easing.bounce]
	);

	const interpolateSubtitleZoom = getKeyFramesInterpolator(
		keyFramesGroup,
		[
			'SUBTITLE_ENTER_START',
			'SUBTITLE_ENTER_END',
			'SUBTITLE_EXIT_START',
			'SUBTITLE_EXIT_END',
		],
		[10, 1, 1, 20],
		[Easing.ease, Easing.ease, Easing.ease]
	);

	const titleOpacity = interpolateTitleOpacity(frame);
	const subtitleOpacity = interpolateSubtitleOpacity(frame);

	const titleZoom = interpolateTitleZoom(frame);
	const subtitleZoom = interpolateSubtitleZoom(frame);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width,
				height,
				backgroundColor: '#222',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					transform: `scale(${titleZoom})`,
					color: '#f05122',
					fontFamily: 'Inter-Bold',
					fontSize: 80,
					opacity: titleOpacity,
				}}
			>
				{title}
			</div>
			<div
				style={{
					transform: `scale(${subtitleZoom})`,
					color: '#f05122',
					fontFamily: 'Inter-Bold',
					fontSize: 50,
					opacity: subtitleOpacity,
				}}
			>
				{subtitle}
			</div>
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
