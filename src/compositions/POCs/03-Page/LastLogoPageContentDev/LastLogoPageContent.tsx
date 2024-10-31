import React from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
} from '../../Keyframes/Keyframes/keyframes';
import {KeyFramesInspector} from '../../Keyframes/Keyframes/KeyframesInspector';
import {LorenzoBertoliniLogoNoAnimation} from '../SimplePage/ThemePage';

export function useLastLogoPageContentKeyframes() {
	const {durationInFrames, fps} = useVideoConfig();

	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		{type: 'SECOND', value: 0, id: 'LOGO_ENTER_START'},
		{
			type: 'R_SECOND',
			value: 1,
			id: 'LOGO_ENTER_END',
			relativeId: 'LOGO_ENTER_START',
		},
		// the linkedin address...
		{
			type: 'R_SECOND',
			value: 0.5,
			id: 'LINK_ENTER_START',
			relativeId: 'LOGO_ENTER_START',
		},
		{
			type: 'R_SECOND',
			value: 1.75,
			id: 'LINK_ENTER_END',
			relativeId: 'LINK_ENTER_START',
		},
	]);

	// TODO perhaps also return interpolators..
	return {keyframes};
}

export const LastLogoPageContent: React.FC<{
	theme: ThemeType;
	baseline?: number;
}> = ({theme, baseline: baselineProp}) => {
	const frame = useCurrentFrame();

	const baseline = baselineProp || theme.page.baseline;

	const {keyframes: keyFramesGroup} = useLastLogoPageContentKeyframes();

	const interpolateLogoOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		['LOGO_ENTER_START', 'LOGO_ENTER_END'],
		[0, 1],
		[Easing.ease]
	);

	const interpolateLogoFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		['LOGO_ENTER_START', 'LOGO_ENTER_END'],
		[10, 0],
		[Easing.ease]
	);

	const interpolateLinkOpacity = getKeyFramesInterpolator(
		keyFramesGroup,
		['LINK_ENTER_START', 'LINK_ENTER_END'],
		[0, 1],
		[Easing.ease]
	);

	const interpolateLinkFilterPixels = getKeyFramesInterpolator(
		keyFramesGroup,
		['LINK_ENTER_START', 'LINK_ENTER_END'],
		[10, 0],
		[Easing.ease]
	);

	const logoOpacity = interpolateLogoOpacity(frame);
	const logoFilterPixels = interpolateLogoFilterPixels(frame);

	const linkOpacity = interpolateLinkOpacity(frame);
	const linkFilterPixels = interpolateLinkFilterPixels(frame);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: baseline / 1.5,
			}}
		>
			<div
				style={{
					opacity: logoOpacity,
					filter: `blur(${logoFilterPixels}px)`,
				}}
			>
				<LorenzoBertoliniLogoNoAnimation
					baseline={baseline}
					theme={theme}
					color={'#fff'}
				/>
			</div>
			<TypographyStyle
				typographyStyle={theme.typography.textStyles.h2}
				baseline={theme.page.baseline / 2}
				style={{
					opacity: linkOpacity,
					filter: `blur(${linkFilterPixels}px)`,
				}}
			>
				www.linkedin.com/in/lorenzobertolini
			</TypographyStyle>
		</div>
	);
};

export const LastLogoPageContentKeyframes: React.FC<{
	theme: ThemeType;
}> = ({theme}) => {
	const frame = useCurrentFrame();
	const {keyframes: keyFramesGroup} = useLastLogoPageContentKeyframes();

	return (
		<KeyFramesInspector
			keyFramesGroup={keyFramesGroup}
			width={700}
			baseFontSize={18}
			frame={frame}
		/>
	);
};
