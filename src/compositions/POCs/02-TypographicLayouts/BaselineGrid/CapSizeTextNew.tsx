import {createStyleObject} from '@capsizecss/core';
import {ReactNode} from 'react';
import {measureText as remotionMeasureText} from '@remotion/layout-utils';
import {TAvailableFontFamily, getFontMetrics} from './fontMetricsLibrary';

export const measureText = ({
	fontFamily,
	fontWeight,
	capHeight,
	lineGap,
	text,
}: {
	fontFamily: TAvailableFontFamily;
	fontWeight: number;
	capHeight: number;
	lineGap: number;
	text: string;
}) => {
	const fontMetrics = getFontMetrics(fontFamily);

	const capSizeStyles = createStyleObject({
		capHeight,
		lineGap,
		fontMetrics,
	});

	return remotionMeasureText({
		fontFamily,
		fontWeight,
		fontSize: capSizeStyles.fontSize,
		text,
	});
};

export const CapSizeTextNew: React.FC<{
	children: ReactNode;
	capHeight: number;
	lineGap: number;
	fontFamily: TAvailableFontFamily;
	fontWeight?: number | string;
	marginBottom?: number;
	color: string;
}> = ({
	children,
	fontFamily,
	fontWeight = 'normal',
	marginBottom = 0,
	color,
	capHeight,
	lineGap,
}) => {
	const fontMetrics = getFontMetrics(fontFamily);

	const capSizeStyles = createStyleObject({
		capHeight,
		lineGap,
		fontMetrics,
	});

	// Generate a unique class name to avoid conflicts
	const className = `text-component-${Math.random().toString(36).substring(7)}`;

	// Create the CSS styles as a string
	const style = `
	 .${className} {
		 font-size: ${capSizeStyles.fontSize};
		 line-height: ${capSizeStyles.lineHeight};
		 font-family: ${fontFamily};
		 font-weight: ${fontWeight};
		 color: ${color};
		 margin-bottom: ${marginBottom}px;
	 }
	 .${className}::before {
		 content: '';
		 display: block;
		 margin-bottom: ${capSizeStyles['::before'].marginBottom};
	 }
	 .${className}::after {
		 content: '';
		 display: block;
		 margin-top: ${capSizeStyles['::after'].marginTop};
	 }
 `;

	return (
		<>
			<style>{style}</style>
			<div className={className}>{children}</div>
		</>
	);
};
