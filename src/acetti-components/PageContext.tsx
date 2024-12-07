import {createContext, useContext, useMemo} from 'react';
import invariant from 'tiny-invariant';

import {ThemeType} from '../acetti-themes/themeTypes';
import {Theme_sizes} from '../acetti-themes/makeThemeGenerator';
import {theme as lorenzobertolinibright} from '../acetti-themes/lorenzobertolinibright';

type TPageContext = {
	width: number;
	height: number;
	marginTop: number;
	marginBottom: number;
	marginLeft: number;
	marginRight: number;
	contentWidth: number;
	contentHeight: number;
	baseline: number;
	theme: ThemeType;
	sizes: Theme_sizes;
};

export const pageContext = createContext<TPageContext>({
	width: 0,
	height: 0,
	marginTop: 0,
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	contentWidth: 0,
	contentHeight: 0,
	baseline: 0,
	theme: lorenzobertolinibright(),
	sizes: {
		lineWidths: {small: 0, medium: 0, large: 0},
		axisTicks: {
			small: 0,
			medium: 0,
			large: 0,
		},
	},
});

type BaselineProp = {
	baseline: number;
	nrBaselines?: never; // Ensure the other prop can't coexist
};

type NrBaselinesProp = {
	nrBaselines: number;
	baseline?: never; // Ensure the other prop can't coexist
};

type BaselineRelatedProp = BaselineProp | NrBaselinesProp;

type PageContextProps = BaselineRelatedProp & {
	children: React.ReactNode;
	width: number;
	height: number;
	margin: number;
	theme: ThemeType;
};

export const PageContext: React.FC<PageContextProps> = ({
	children,
	width,
	height,
	margin,
	nrBaselines,
	baseline: baselineProp,
	theme,
}) => {
	invariant(
		baselineProp || nrBaselines,
		'PageContext: pass either baseline or nrBaselines!'
	);
	const marginTop = margin;
	const marginBottom = margin;
	const marginLeft = margin;
	const marginRight = margin;
	const contentHeight = height - marginTop - marginBottom;
	const contentWidth = width - marginRight - marginLeft;
	const baseline = baselineProp
		? baselineProp
		: contentHeight / (nrBaselines as number);

	const sizes = useMemo(
		() => ({
			lineWidths: {
				small: theme.sizes.lineWidths.small * baseline,
				medium: theme.sizes.lineWidths.medium * baseline,
				large: theme.sizes.lineWidths.large * baseline,
			},
			axisTicks: {
				small: theme.sizes.axisTicks.small * baseline,
				medium: theme.sizes.axisTicks.medium * baseline,
				large: theme.sizes.axisTicks.large * baseline,
			},
		}),
		[theme, baseline]
	);

	return (
		<pageContext.Provider
			value={{
				width,
				height,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,
				contentWidth,
				contentHeight,
				baseline,
				theme,
				sizes,
			}}
		>
			{children}
		</pageContext.Provider>
	);
};

export const usePage = () => {
	const contextValue = useContext(pageContext);
	return contextValue;
};
