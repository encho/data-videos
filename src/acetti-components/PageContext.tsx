import {createContext, useContext} from 'react';

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
});

export const PageContext: React.FC<{
	children: React.ReactNode;
	width: number;
	height: number;
	margin: number;
	nrBaselines: number;
}> = ({children, width, height, margin, nrBaselines}) => {
	const marginTop = margin;
	const marginBottom = margin;
	const marginLeft = margin;
	const marginRight = margin;
	const contentHeight = height - marginTop - marginBottom;
	const contentWidth = width - marginRight - marginLeft;
	const baseline = contentHeight / nrBaselines;

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