import {z} from 'zod';
import React from 'react';
import {useCurrentFrame, useVideoConfig, Easing} from 'remotion';

import {KeyFramesInspector} from './KeyframesInspector';
// import {Position} from '../../../../acetti-ts-base/Position';
// import {ObliquePlatte} from '../../../../acetti-components/ObliquePlatte';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {SlideTitle} from '../../02-TypographicLayouts/SlideTitle';
import {buildKeyFramesGroup, getKeyFramesInterpolator} from './keyframes';

export const keyframesCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const KeyframesComposition: React.FC<
	z.infer<typeof keyframesCompositionSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader(['Inter-Regular', 'Inter-Bold']);
	const {durationInFrames, fps} = useVideoConfig();
	const frame = useCurrentFrame();
	const theme = getThemeFromEnum(themeEnum as any);

	const keyFramesGroup = buildKeyFramesGroup(durationInFrames, fps, [
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
	]);

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

	const interpolateZoom = getKeyFramesInterpolator(
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

	const titleOpacity = interpolateTitleOpacity(frame);
	const zoom = interpolateZoom(frame);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>Keyframe-Transitions</SlideTitle>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 0,
					marginBottom: 70,
				}}
			>
				<div
					style={{
						display: 'flex',
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
							transform: `scale(${zoom})`,
							color: '#f05122',
							fontFamily: 'Inter-Bold',
							fontSize: 80,
							opacity: titleOpacity,
						}}
					>
						Halloween
					</div>
				</div>
			</div>

			<div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
				<KeyFramesInspector
					keyFramesGroup={keyFramesGroup}
					width={700}
					baseFontSize={18}
					frame={frame}
				/>
			</div>

			{/* <AbsoluteFill>
				<Position position={{left: 150, top: 900}}>
					<ObliquePlatte width={800} height={400} theme={theme.platte}>
						<div
							style={{display: 'flex', justifyContent: 'center', marginTop: 40}}
						>
							<KeyFramesInspector
								keyFramesGroup={keyFramesGroup}
								width={500}
								baseFontSize={16}
								frame={frame}
							/>
						</div>
					</ObliquePlatte>
				</Position>
			</AbsoluteFill> */}

			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
