import {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';

export const Position = ({
	position,
	children,
	size = {},
	fill = 'transparent',
}: {
	position: {
		left?: number | string;
		top?: number | string;
		bottom?: number | string;
		right?: number | string;
	};
	size?: {width?: number | string; height?: number | string};
	children: ReactNode;
	fill?: string;
}) => {
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					// transformStyle: 'inherit',
					// backgroundColor: 'rgba(0,0,255,0.8)',
					// backgroundColor: 'rgba(0,0,255,0.8)',
					// backgroundColor: 'rgba(255,0,0,0.1)',
					// border: '5px solid magenta',
				}}
			>
				<div
					style={{
						position: 'absolute',
						backgroundColor: fill,
						...position,
						...size,
					}}
				>
					{children}
				</div>
			</div>
		</AbsoluteFill>
	);
};
