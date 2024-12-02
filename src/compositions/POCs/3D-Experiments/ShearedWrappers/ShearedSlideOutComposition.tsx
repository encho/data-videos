import {ReactNode} from 'react';
import {
	interpolate,
	// spring,
	Easing,
	useCurrentFrame,
	useVideoConfig,
	// useVideoConfig,
} from 'remotion';
import {z} from 'zod';

import {
	buildKeyFramesGroup,
	getKeyFramesInterpolator,
} from '../../Keyframes/Keyframes/keyframes';
import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';
import {PageContext} from '../../../../acetti-components/PageContext';
import {Page} from '../../../../acetti-components/Page';
import {TypographyStyle} from '../../02-TypographicLayouts/TextStyles/TextStylesComposition';

export const shearedSlideOutCompositionSchema = z.object({
	themeEnum: zThemeEnum,
	themeEnumPlatte: zThemeEnum,
});

export const ShearedSlideOutComposition: React.FC<
	z.infer<typeof shearedSlideOutCompositionSchema>
> = ({themeEnum, themeEnumPlatte}) => {
	const {width, height} = useVideoConfig();

	const theme = useThemeFromEnum(themeEnum);
	const themePlatte = useThemeFromEnum(themeEnumPlatte);

	return (
		<div style={{width, height, backgroundColor: theme.global.backgroundColor}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					// backgroundColor: 'cyan',
				}}
			>
				{/* <Sequence>
				</Sequence>	 */}
				<Platte3D width={width} height={height}>
					<PageContext
						margin={80}
						nrBaselines={50}
						width={width}
						height={height}
						theme={themePlatte}
					>
						<Page>
							{({baseline, theme}) => {
								return (
									<TypographyStyle
										typographyStyle={theme.typography.textStyles.h1}
										baseline={baseline}
										marginBottom={7}
									>
										Platte Content Here...
									</TypographyStyle>
								);
							}}
						</Page>
					</PageContext>
				</Platte3D>
			</div>
		</div>
	);
};

const Platte3D: React.FC<{
	children: ReactNode;
	width: number;
	height: number;
}> = ({children, width, height}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	// TODO useMemo
	const keyframes = buildKeyFramesGroup(durationInFrames, fps, [
		{type: 'SECOND', value: 0.8, id: 'PLATTE_ENTER_TO_BACKGROUND_START'},
		{
			type: 'R_SECOND',
			value: 0.8,
			id: 'PLATTE_ENTER_TO_BACKGROUND_END',
			relativeId: 'PLATTE_ENTER_TO_BACKGROUND_START',
		},
		{
			type: 'R_SECOND',
			value: 0.8,
			id: 'PLATTE_TO_FOREGROUND_START',
			relativeId: 'PLATTE_ENTER_TO_BACKGROUND_END',
		},
		{
			type: 'R_SECOND',
			value: 0.8,
			id: 'PLATTE_TO_FOREGROUND_END',
			relativeId: 'PLATTE_TO_FOREGROUND_START',
		},
		{
			type: 'R_SECOND',
			value: 0.8,
			id: 'PLATTE_TO_BACKGROUND_START',
			relativeId: 'PLATTE_TO_FOREGROUND_END',
		},
		{
			type: 'R_SECOND',
			value: 0.8,
			id: 'PLATTE_TO_BACKGROUND_END',
			relativeId: 'PLATTE_TO_BACKGROUND_START',
		},
		{
			type: 'SECOND',
			value: -0.5,
			id: 'PLATTE_EXIT_END',
		},
		{
			type: 'R_SECOND',
			value: -0.5,
			id: 'PLATTE_EXIT_START',
			relativeId: 'PLATTE_EXIT_END',
		},
	]);

	// TODO check that PLATTE_TO_BACKGROUND_END < PLATTE_EXIT_START
	// invariant(...)

	// TODO useMemo
	const translateZ = getKeyFramesInterpolator(
		keyframes,
		[
			'PLATTE_TO_BACKGROUND_START',
			'PLATTE_TO_BACKGROUND_END',
			'PLATTE_EXIT_START',
			'PLATTE_EXIT_END',
		],
		[0, -200, -200, -3000],
		[Easing.ease, Easing.ease, Easing.bezier(0.83, 0, 0.17, 1)] // easeInOutQuint
	)(frame);

	// TODO useMemo
	const rotateY = getKeyFramesInterpolator(
		keyframes,
		[
			'PLATTE_TO_BACKGROUND_START',
			'PLATTE_TO_BACKGROUND_END',
			'PLATTE_EXIT_START',
			'PLATTE_EXIT_END',
		],
		[0, -5, -5, -20],
		[Easing.ease, Easing.ease, Easing.bezier(0.83, 0, 0.17, 1)] // easeInOutQuint
	)(frame);

	const translateX = getKeyFramesInterpolator(
		keyframes,
		[
			'PLATTE_TO_BACKGROUND_START',
			'PLATTE_TO_BACKGROUND_END',
			'PLATTE_EXIT_START',
			'PLATTE_EXIT_END',
		],
		[0, 0, 50, -20000],
		[Easing.ease, Easing.ease, Easing.bezier(0.83, 0, 0.17, 1)] // easeInOutQuint
	)(frame);

	// Define perspective depth
	// const perspectiveDepth = 500;
	const perspectiveDepth = 500;

	// // Interpolate translation and rotation for animation
	// const translateZ = interpolate(
	// 	frame,
	// 	[0, 100],
	// 	[0, -200],
	// 	// [0, 0],
	// 	// [0, -300],
	// 	{
	// 		extrapolateRight: 'clamp',
	// 		easing: Easing.bezier(0.22, 1, 0.36, 1),
	// 	}
	// );
	// const rotateY = interpolate(
	// 	frame,
	// 	[0, 100],
	// 	// [0, 0],
	// 	[0, -5],
	// 	// [-30, -30],
	// 	// [0, 45]
	// 	{
	// 		extrapolateRight: 'clamp',
	// 	}
	// );
	// const translateX = interpolate(
	// 	frame,
	// 	[0, 100],
	// 	// [0, -300],
	// 	// [0, -2000],
	// 	[0, 0],
	// 	{
	// 		// easeOutQuint
	// 		easing: Easing.bezier(0.22, 1, 0.36, 1),
	// 		extrapolateRight: 'clamp',
	// 	}
	// );

	return (
		<div
			style={{
				// width: '500px',
				// height: '300px',
				width,
				height,
				position: 'relative',
				margin: '0 auto',
				backgroundColor: 'lightblue',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'black',
				fontSize: '24px',
				borderRadius: '10px',
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				transformStyle: 'preserve-3d', // Ensures child elements respect 3D perspective
				perspective: `${perspectiveDepth}px`, // Set perspective for parent container
				transform: `perspective(${perspectiveDepth}px) translateY(0px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
			}}
		>
			{children}
		</div>
	);
};

const Platte3D_2: React.FC<{children: ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();

	// Define perspective depth
	const perspectiveDepth = 800;

	// Interpolate translation and rotation for animation
	const translateZ = interpolate(
		frame,
		[0, 100],
		[0, -600],
		// [0, -300],
		{
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.22, 1, 0.36, 1),
		}
	);
	const rotateY = interpolate(
		frame,
		[0, 100],
		[-30, -30],
		// [0, 45]
		{
			extrapolateRight: 'clamp',
		}
	);
	const translateX = interpolate(
		frame,
		[0, 100],
		// [0, -300],
		[0, -2000],
		{
			// easeOutQuint
			easing: Easing.bezier(0.22, 1, 0.36, 1),
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div
			style={{
				position: 'relative',
				width: '500px',
				height: '300px',
				margin: '0 auto',
				backgroundColor: 'lightblue',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'black',
				fontSize: '24px',
				borderRadius: '10px',
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				transformStyle: 'preserve-3d', // Ensures child elements respect 3D perspective
				perspective: `${perspectiveDepth}px`, // Set perspective for parent container
				transform: `perspective(${perspectiveDepth}px) translateY(0px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
			}}
		>
			{children}
		</div>
	);
};
