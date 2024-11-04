import {ReactNode} from 'react';

import {CapSizeTextNew} from '../../../../acetti-typography/CapSizeTextNew';
import {ThemeType} from '../../../../acetti-themes/themeTypes';
import {TextAnimationSubtle} from '../../01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';

export function Page({
	theme,
	children,
}: // width: widthProp,
// height: heightProp,
{
	theme: ThemeType;
	children: ReactNode;
	// width?: number;
	// height?: number;
}) {
	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div
				style={{
					marginTop: theme.page.marginTop,
					marginBottom: theme.page.marginBottom,
					marginRight: theme.page.marginRight,
					marginLeft: theme.page.marginLeft,
				}}
			>
				<div
					style={{
						width: theme.page.contentWidth,
						height: theme.page.contentHeight,
						position: 'relative',
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
}

export const PageFooter: React.FC<{
	children: React.ReactNode;
	theme: ThemeType;
	showArea?: boolean;
}> = ({children, theme, showArea = false}) => {
	const baseline = theme.page.baseline;
	const paddingTopInBaselines = 4;

	return (
		<div
			style={{
				backgroundColor: showArea ? 'rgba(255,100,0,0.2)' : undefined,
				paddingTop: paddingTopInBaselines * baseline,
			}}
		>
			{children}
		</div>
	);
};

export const PageHeader: React.FC<{
	children: React.ReactNode;
	theme: ThemeType;
	showArea?: boolean;
}> = ({children, theme, showArea = false}) => {
	const baseline = theme.page.baseline;
	const paddingBottomInBaselines = 4;

	return (
		<div
			style={{
				backgroundColor: showArea ? 'rgba(255,100,0,0.2)' : undefined,
				paddingBottom: paddingBottomInBaselines * baseline,
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
		<CapSizeTextNew
			fontFamily={'Inter-Regular'}
			capHeight={capHeight}
			lineGap={0}
			color={color}
		>
			<TextAnimationSubtle translateY={baseline * 1.1}>
				<span>lorenzo</span>
				<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
			</TextAnimationSubtle>
		</CapSizeTextNew>
	);
};

export const LorenzoBertoliniLogoNoAnimation = ({
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
		<CapSizeTextNew
			fontFamily={'Inter-Regular'}
			capHeight={capHeight}
			lineGap={0}
			color={color}
		>
			<span>lorenzo</span>
			<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
		</CapSizeTextNew>
	);
};
