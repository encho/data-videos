import {ReactNode} from 'react';

import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {ThemeType} from '../../../../acetti-themes/themeTypes';

export function ThemePage({
	theme,
	children,
}: {
	theme: ThemeType;
	children: ReactNode;
}) {
	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				// backgroundColor: '#000444',
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					// backgroundColor: 'rgba(0,255,255,0.2)',
					marginTop: theme.page.marginTop,
					marginBottom: theme.page.marginBottom,
					marginRight: theme.page.marginRight,
					marginLeft: theme.page.marginLeft,
				}}
			>
				{children}
			</div>
		</div>
	);
}

export const PageFooter: React.FC<{
	children: React.ReactNode;
	theme: ThemeType;
}> = ({children, theme}) => {
	const baseline = theme.page.baseline;
	const paddingTopInBaselines = 3;

	return (
		<div
			style={{
				paddingTop: paddingTopInBaselines * baseline,
				// backgroundColor: 'rgba(255,0,255,0.3)',
			}}
		>
			{children}
		</div>
	);
};

export function PageLogo({theme}: {theme: ThemeType}) {
	return (
		<div
			style={{
				position: 'fixed',
				bottom: theme.page.marginBottom,
				right: theme.page.marginRight,
			}}
		>
			<LorenzoBertoliniLogo
				baseline={theme.page.baseline}
				capHeightInBaselines={1.5}
				theme={theme}
			/>
		</div>
	);
}

export const LorenzoBertoliniLogo = ({
	theme,
	color: colorProp,
	baseline,
	capHeightInBaselines = 1,
}: {
	theme: ThemeType;
	color?: string;
	capHeightInBaselines?: number;
	baseline: number;
}) => {
	const color = colorProp || theme.typography.logoColor;
	const capHeight = baseline * capHeightInBaselines;

	return (
		<div
		// style={{zIndex: 1000}}
		>
			<CapSizeTextNew
				fontFamily={'Inter-Regular'}
				capHeight={capHeight}
				lineGap={0}
				color={color}
			>
				<span>lorenzo</span>
				<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
			</CapSizeTextNew>
		</div>
	);
};
