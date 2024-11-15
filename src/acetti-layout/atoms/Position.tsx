import {ReactNode} from 'react';

export const Position = ({
	position,
	zIndex,
	children,
	size = {},
	// fill = 'transparent',
	backgroundColor,
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
	// fill?: string;
	backgroundColor?: string;
}) => {
	return (
		<div
			style={{
				zIndex: zIndex || 'auto',
				position: 'relative',
				backgroundColor: backgroundColor || 'transparent',
			}}
		>
			<div
				style={{
					position: 'absolute',
					// backgroundColor: fill,
					...position,
					...size,
				}}
			>
				{children}
			</div>
		</div>
	);
};
