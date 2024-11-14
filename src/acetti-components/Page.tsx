import {ReactNode} from 'react';

import chroma from 'chroma-js';
import {CapSizeTextNew} from '../acetti-typography/CapSizeTextNew';
import {ThemeType} from '../acetti-themes/themeTypes';
import {TextAnimationSubtle} from '../compositions/POCs/01-TextEffects/TextAnimations/TextAnimationSubtle/TextAnimationSubtle';
import {usePage} from './PageContext';

type PageChildFunctionArgs = {
	marginTop: number;
	marginBottom: number;
	marginLeft: number;
	marginRight: number;
	contentWidth: number;
	contentHeight: number;
	baseline: number;
};

type PageChildren = ReactNode | ((props: PageChildFunctionArgs) => ReactNode);

export function Page({
	children,
	show = false,
	borderRadius,
	boxShadow: boxShadowProp = false,
}: {
	children: PageChildren;
	show?: boolean;
	boxShadow?: boolean;
	borderRadius?: number; // TODO borderRadius: "S" | "NONE" | "M" | "XL"...
}) {
	const page = usePage();

	const {theme} = page;

	// const devLineColor = '#00ddaa';
	// const devCornerColor = chroma(devLineColor).alpha(0.35).css(); // 50% transparency

	const devLineColor = theme.typography.textStyles.h1.color; // QUICK-FIX
	const devCornerColor = chroma(devLineColor).alpha(0.35).css(); // 50% transparency

	// see: https://getcssscan.com/css-box-shadow-examples
	const boxShadow = boxShadowProp
		? // ? 'rgb(38, 57, 77) 0px 20px 30px -10px' // # 20
		  'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' // #18
		: undefined;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				width: page.width,
				height: page.height,
				position: 'relative',
				borderRadius,
				boxShadow,
			}}
		>
			<div style={{position: 'absolute', width: '100%', height: '100%'}}>
				{show ? (
					<>
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: page.marginLeft,
								height: page.marginTop,
								backgroundColor: devCornerColor,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								width: page.marginLeft,
								height: page.marginBottom,
								backgroundColor: devCornerColor,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								top: 0,
								right: 0,
								width: page.marginRight,
								height: page.marginTop,
								backgroundColor: devCornerColor,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								width: page.marginRight,
								height: page.marginBottom,
								backgroundColor: devCornerColor,
							}}
						/>
					</>
				) : null}
				<div
					style={{
						marginTop: page.marginTop,
						marginBottom: page.marginBottom,
						marginRight: page.marginRight,
						marginLeft: page.marginLeft,
					}}
				>
					<div
						style={{
							width: page.contentWidth,
							height: page.contentHeight,
							position: 'relative',
							border: show ? `2px solid ${devLineColor}` : 'transparent',
						}}
					>
						{typeof children === 'function' ? children(page) : children}
					</div>
				</div>
			</div>
		</div>
	);
}

export const PageFooter: React.FC<{
	children: React.ReactNode;
	showArea?: boolean;
}> = ({children, showArea = false}) => {
	const page = usePage();

	const {baseline} = page;
	const paddingTopInBaselines = 5;

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
	showArea?: boolean;
}> = ({children, showArea = false}) => {
	const page = usePage();
	const {baseline} = page;
	const paddingBottomInBaselines = 3;

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

export function PageLogo() {
	const page = usePage();

	return (
		<div
			style={{
				position: 'fixed',
				bottom: page.marginBottom,
				right: page.marginRight,
			}}
		>
			<LorenzoBertoliniLogo
				baseline={page.baseline}
				capHeightInBaselines={1.5}
				theme={page.theme}
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
			fontFamily="Inter-Regular"
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
			fontFamily="Inter-Regular"
			capHeight={capHeight}
			lineGap={0}
			color={color}
		>
			<span>lorenzo</span>
			<span style={{fontFamily: 'Inter-Bold'}}>bertolini</span>
		</CapSizeTextNew>
	);
};
