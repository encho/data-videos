import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThemeType} from '../../../acetti-themes/themeTypes';

export const EconomistDataSource = ({
	children,
	theme,
}: {
	children: string;
	theme: ThemeType;
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const fontSize = 32; // TODO should come from theme or global page context or so
	const color = theme.EconomistDataSource.textColor;

	const entryDurationInFrames = fps * 1;

	const percentageProgress = frame / entryDurationInFrames;

	const barProgress = interpolate(percentageProgress, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const zero_to_1 = easings.easeOutQuint(barProgress);

	return (
		<div
			className="absolute"
			style={{
				opacity: zero_to_1,
				bottom: 40, // TODO here and the logo should take this info from global page/slide context
				left: 40, // TODO here and the logo should take this info from global page/slide context
			}}
		>
			<div style={{color, fontSize, fontFamily: 'Inter-Regular'}}>
				Source: {children}
			</div>
		</div>
	);
};

function easeOutQuint(x: number): number {
	return 1 - Math.pow(1 - x, 5);
}

const easings = {
	easeOutQuint,
};
