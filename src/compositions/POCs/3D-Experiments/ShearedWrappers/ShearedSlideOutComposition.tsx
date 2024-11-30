import {
	interpolate,
	// spring,
	Easing,
	useCurrentFrame,
	// useVideoConfig,
} from 'remotion';
import {z} from 'zod';

import {zThemeEnum} from '../../../../acetti-themes/getThemeFromEnum';
// import {useThemeFromEnum} from '../../../../acetti-themes/getThemeFromEnum';

export const shearedSlideOutCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ShearedSlideOutComposition: React.FC<
	z.infer<typeof shearedSlideOutCompositionSchema>
> = ({themeEnum}) => {
	// const {width, height} = useVideoConfig();
	// const _theme = useThemeFromEnum(themeEnum);
	const frame = useCurrentFrame();
	// const {width, height} = useVideoConfig();

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
				transform: `perspective(${perspectiveDepth}px) translateY(100px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
			}}
		>
			3D Perspective Content
		</div>
	);
};
