import {z} from 'zod';
import {createStyleObject} from '@capsizecss/core';
import styled, {css} from 'styled-components';
import {ReactNode} from 'react';
import invariant from 'tiny-invariant';

import {useFontFamiliesLoader} from '../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {ElementsLogo} from './ElementsLogo';
import {CapSizeTextNew} from './CapSizeTextNew';

// const CapSizeTextNew: React.FC<{
// 	children: ReactNode;
// 	capHeight: number;
// 	lineGap: number;
// 	fontFamily: 'Inter';
// 	fontWeight: number;
// 	color: string;
// }> = ({children, fontFamily, fontWeight, color, capHeight, lineGap}) => {
// 	const fontMetrics = fontFamily === 'Inter' ? INTER_CAPSIZE_MEASURES : null;
// 	invariant(fontMetrics);

// 	const capSizeStyles = createStyleObject({
// 		capHeight,
// 		lineGap,
// 		fontMetrics,
// 	});

// 	// Generate a unique class name to avoid conflicts
// 	const className = `${fontFamily}-${capHeight}-${lineGap}-${fontWeight}`;

// 	// Create the CSS styles as a string
// 	const style = `
// 	 .${className} {
// 		 font-size: ${capSizeStyles.fontSize};
// 		 line-height: ${capSizeStyles.lineHeight};
// 		 font-family: ${fontFamily};
// 		 font-weight: ${fontWeight};
// 		 color: ${color};
// 	 }
// 	 .${className}::before {
// 		 content: '';
// 		 display: block;
// 		 margin-bottom: ${capSizeStyles['::before'].marginBottom};
// 	 }
// 	 .${className}::after {
// 		 content: '';
// 		 display: block;
// 		 margin-top: ${capSizeStyles['::after'].marginTop};
// 	 }
//  `;

// 	return (
// 		<>
// 			<style>{style}</style>
// 			<div className={className}>{children}</div>
// 		</>
// 	);
// };

// const CapSizeText: React.FC<{
// 	children: ReactNode;
// 	capHeight: number;
// 	lineGap: number;
// 	fontFamily: 'Inter';
// 	fontWeight: number;
// 	color: string;
// }> = ({children, fontFamily, fontWeight, color, capHeight, lineGap}) => {
// 	const fontMetrics = fontFamily === 'Inter' ? INTER_CAPSIZE_MEASURES : null;
// 	invariant(fontMetrics);

// 	const capSizeStyles = createStyleObject({
// 		capHeight,
// 		lineGap,
// 		fontMetrics,
// 	});

// 	return (
// 		<div
// 			style={{
// 				marginBottom: capSizeStyles['::before'].marginBottom,
// 				marginTop: capSizeStyles['::after'].marginTop,
// 			}}
// 		>
// 			<div
// 				style={{
// 					color,
// 					// fontWeight,
// 					fontFamily,
// 					fontSize: capSizeStyles.fontSize,
// 					lineHeight: capSizeStyles.lineHeight,
// 				}}
// 			>
// 				{children}
// 			</div>
// 		</div>
// 	);
// };

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

// INTERESTING RESOURCES
// *****************************************************************
// https://maketypework.com/web-typography-baseline-grids-made-easy/
// *****************************************************************

// const GlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     padding: 0;
//   }
// `;

export const capsizeTrimmingPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const CapsizeTrimmingPOC: React.FC<
	z.infer<typeof capsizeTrimmingPOCSchema>
> = ({themeEnum}) => {
	useFontFamiliesLoader(['Inter-Regular']);

	const theme = getThemeFromEnum(themeEnum as any);

	const BASELINE_HEIGHT = 18;
	const NR_LINES = 34;

	const PAPER_WIDTH = 400;
	const PAPER_HEIGHT = NR_LINES * BASELINE_HEIGHT;

	const LINEGAP = BASELINE_HEIGHT * 1;

	const styles = createStyleObject({
		capHeight: BASELINE_HEIGHT,
		lineGap: LINEGAP,
		fontMetrics: INTER_CAPSIZE_MEASURES,
	});

	const stylesForStyledComponents = {
		fontSize: styles.fontSize,
		lineHeight: styles.lineHeight,
		'&::before': {
			...styles['::before'],
			marginBottom: styles['::before'].marginBottom, // could be animated
		},
		'&::after': {
			...styles['::after'],
			marginTop: styles['::after'].marginTop, // could be animated
		},
	};

	// TODO simulate default styles for animating and showing capsize utility
	const defaultStyles = {
		fontSize: BASELINE_HEIGHT,
		lineHeight: (BASELINE_HEIGHT + LINEGAP) / BASELINE_HEIGHT,
		// TODO add for animations!!
		// '&::before': {
		// 	content: '""',
		// 	display: 'table',
		// 	marginBottom: styles['::before'].marginBottom, // could be animated
		// },
		// '&::after': {
		// 	content: '""',
		// 	display: 'table',
		// 	marginTop: styles['::after'].marginTop, // could be animated
		// },
	};

	// Convert the style object into a css block
	const dynamicStyles = css(stylesForStyledComponents);
	const defaultDynamicStyles = css(defaultStyles);

	// Use the dynamic styles in your styled component
	const TrimmedText = styled.div`
		color: white;
		${dynamicStyles}; /* Inject the dynamic styles */
		font-family: Inter;
	`;

	const DefaultText = styled.div`
		color: white;
		${defaultDynamicStyles}; /* Inject the dynamic styles */
		font-family: Inter;
	`;

	return (
		<>
			<div
				style={{
					backgroundColor: theme.global.backgroundColor,
					position: 'absolute',
					width: '100%',
					height: '100%',
					// marginTop: 0,
					// marginBottom: 0,
				}}
			>
				<div style={{position: 'relative'}}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<div
							style={{
								color: theme.typography.title.color,
								fontSize: 80,
								marginTop: 100,
								fontWeight: 700,
							}}
						>
							Capsize Trimming
						</div>
					</div>
				</div>
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
					<div style={{display: 'flex', gap: 40}}>
						<div
							style={{
								width: PAPER_WIDTH,
								height: PAPER_HEIGHT,
								position: 'relative',
							}}
						>
							{/* baseline grid */}
							{/* TODO <BaselineGrid nrLines baselineHeight width .../> */}
							<div style={{position: 'absolute', top: 0, left: 0}}>
								<svg
									width={PAPER_WIDTH}
									height={PAPER_HEIGHT}
									style={{
										backgroundColor: 'rgba(255,100,0,0.3)',
									}}
								>
									{[...new Array(NR_LINES - 1).keys()].map((it, i) => {
										return (
											<line
												x1={0}
												x2={PAPER_WIDTH}
												y1={(i + 1) * BASELINE_HEIGHT}
												y2={(i + 1) * BASELINE_HEIGHT}
												stroke={'rgb(255,100,0)'}
												strokeWidth={2}
											/>
										);
									})}
								</svg>
							</div>

							<div
								style={{
									display: 'flex',
									gap: 2 * LINEGAP,
									flexDirection: 'column',
								}}
							>
								<DefaultText>
									The quick brown fox jumps over the lazy dog. As dawn breaks,
									the sun shines with a soft, golden glow. In the distance,
									birds chirp harmoniously, their melodies echoing through the
									crisp air. The breeze carries the scent of fresh pine,
									intertwining with the sweet aroma of blooming flowers. Slowly,
									the town wakes up, the sound of footsteps and chatter filling
									the streets.
								</DefaultText>
							</div>
						</div>

						<div
							style={{
								width: PAPER_WIDTH,
								height: PAPER_HEIGHT,
								position: 'relative',
							}}
						>
							{/* baseline grid */}
							{/* TODO <BaselineGrid nrLines baselineHeight width .../> */}
							<div style={{position: 'absolute', top: 0, left: 0}}>
								<svg
									width={PAPER_WIDTH}
									height={PAPER_HEIGHT}
									style={{
										backgroundColor: 'rgba(255,100,0,0.3)',
									}}
								>
									{[...new Array(NR_LINES - 1).keys()].map((it, i) => {
										return (
											<line
												x1={0}
												x2={PAPER_WIDTH}
												y1={(i + 1) * BASELINE_HEIGHT}
												y2={(i + 1) * BASELINE_HEIGHT}
												stroke={'rgb(255,100,0)'}
												strokeWidth={2}
											/>
										);
									})}
								</svg>
							</div>

							<div
								style={{
									display: 'flex',
									gap: 2 * LINEGAP,
									flexDirection: 'column',
								}}
							>
								{/* <TrimmedText>
									The quick brown fox jumps over the lazy dog. As dawn breaks,
									the sun shines with a soft, golden glow. In the distance,
									birds chirp harmoniously, their melodies echoing through the
									crisp air. The breeze carries the scent of fresh pine,
									intertwining with the sweet aroma of blooming flowers. Slowly,
									the town wakes up, the sound of footsteps and chatter filling
									the streets.
								</TrimmedText> */}

								<TrimmedText>
									The quick brown fox jumps over the lazy dog. As dawn breaks,
									the sun shines with a soft, golden glow. In the distance,
									birds chirp harmoniously, their melodies echoing through the
									crisp air. The breeze carries the scent of fresh pine,
									intertwining with the sweet aroma of blooming flowers. Slowly,
									the town wakes up, the sound of footsteps and chatter filling
									the streets.
								</TrimmedText>

								<CapSizeTextNew
									fontFamily="Inter"
									fontWeight={700}
									capHeight={BASELINE_HEIGHT}
									lineGap={BASELINE_HEIGHT}
									color="yellow"
								>
									The quick brown fox jumps over the lazy dog. As dawn breaks,
									the sun shines with a soft, golden glow. In the distance,
									birds chirp harmoniously, their melodies echoing through the
									crisp air. The breeze carries the scent of fresh pine,
									intertwining with the sweet aroma of blooming flowers. Slowly,
									the town wakes up, the sound of footsteps and chatter filling
									the streets.
								</CapSizeTextNew>

								{/* <TrimmedText>{JSON.stringify(stylesForStyledComponents)}</TrimmedText> */}
							</div>
						</div>
					</div>
				</div>

				<ElementsLogo cell_size={4} />
				<LorenzoBertoliniLogo color={theme.typography.textColor} />
			</div>
		</>
	);
};
