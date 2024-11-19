import {ReactNode} from 'react';

export const Value = ({children}: {children: ReactNode}) => {
	return <div style={{color: '#f05122'}}>{children}</div>;
};

export const Row = ({children}: {children: ReactNode}) => {
	return (
		<div
			style={{
				display: 'flex',
				gap: 20,
				backgroundColor: 'rgba(0,0,0,0.3)',
				color: '#00aa99',
				padding: 0,
				fontWeight: 800,
			}}
		>
			{children}
		</div>
	);
};
