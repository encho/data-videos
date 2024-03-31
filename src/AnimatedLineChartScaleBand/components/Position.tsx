import {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';

export const Position = ({
	position,
	zIndex,
	children,
	size = {},
	fill = 'transparent',
}: {
	zIndex?: number;
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
					zIndex: zIndex || 'auto',
					position: 'relative',
					width: '100%',
					height: '100%',
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
