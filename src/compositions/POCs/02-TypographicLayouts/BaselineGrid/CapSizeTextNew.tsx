import {createStyleObject} from '@capsizecss/core';
import {ReactNode} from 'react';
import invariant from 'tiny-invariant';
import {measureText as remotionMeasureText} from '@remotion/layout-utils';

export const measureText = ({
	fontFamily,
	fontWeight,
	capHeight,
	lineGap,
	text,
}: {
	fontFamily: 'Inter' | 'Inter-Regular' | 'Inter-Bold';
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

export const getFontMetrics = (
	fontFamily: 'Inter' | 'Inter-Regular' | 'Inter-Bold'
) => {
	const fontMetrics =
		fontFamily === 'Inter'
			? INTER_CAPSIZE_MEASURES
			: fontFamily === 'Inter-Regular'
			? INTER_CAPSIZE_MEASURES
			: fontFamily === 'Inter-Bold'
			? INTER_CAPSIZE_MEASURES
			: null;
	invariant(fontMetrics);
	return fontMetrics;
};

export const CapSizeTextNew: React.FC<{
	children: ReactNode;
	capHeight: number;
	lineGap: number;
	fontFamily: 'Inter' | 'Inter-Regular' | 'Inter-Bold';
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

const INTER_CAPSIZE_MEASURES = {
	familyName: 'Inter',
	fullName: 'Inter Regular',
	postscriptName: 'Inter-Regular',
	capHeight: 1490,
	ascent: 1984,
	descent: -494,
	lineGap: 0,
	unitsPerEm: 2048,
	xHeight: 1118,
	xWidthAvg: 978,
	subsets: {
		latin: {
			xWidthAvg: 978,
		},
		thai: {
			xWidthAvg: 1344,
		},
	},
};
