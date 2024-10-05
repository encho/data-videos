import {createStyleObject} from '@capsizecss/core';
import {ReactNode} from 'react';
import invariant from 'tiny-invariant';

export const CapSizeTextNew: React.FC<{
	children: ReactNode;
	capHeight: number;
	lineGap: number;
	fontFamily: 'Inter';
	fontWeight: number;
	color: string;
}> = ({children, fontFamily, fontWeight, color, capHeight, lineGap}) => {
	const fontMetrics = fontFamily === 'Inter' ? INTER_CAPSIZE_MEASURES : null;
	invariant(fontMetrics);

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
