import {z} from 'zod';
import {createStyleObject} from '@capsizecss/core';
import styled, {css} from 'styled-components';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {ElementsLogo} from './ElementsLogo';

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
								<TrimmedText>
									The quick brown fox jumps over the lazy dog. As dawn breaks,
									the sun shines with a soft, golden glow. In the distance,
									birds chirp harmoniously, their melodies echoing through the
									crisp air. The breeze carries the scent of fresh pine,
									intertwining with the sweet aroma of blooming flowers. Slowly,
									the town wakes up, the sound of footsteps and chatter filling
									the streets.
								</TrimmedText>
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
