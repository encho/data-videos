import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package
import {BaselineGrid} from './BaselineGrid';
import {useFontFamiliesLoader} from '../../../../acetti-typography/new/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
// import {ElementsLogo} from './ElementsLogo';
import {SlideTitle} from '../SlideTitle';
// import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';

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

export const baselineGridCompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const BaselineGridComposition: React.FC<
	z.infer<typeof baselineGridCompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	// load fonts
	// ********************************************************
	useFontFamiliesLoader(theme);

	const {fps} = useVideoConfig();

	const BASELINE_HEIGHT = 30;
	const NR_LINES = 30;
	const PAPER_WIDTH = 800;
	const PAPER_HEIGHT = NR_LINES * BASELINE_HEIGHT;

	return (
		<>
			<div
				style={{
					backgroundColor: theme.global.backgroundColor,
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			>
				<SlideTitle theme={theme}>The Baseline Grid</SlideTitle>
				<Sequence from={fps * 0.8} layout="none">
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								width: PAPER_WIDTH,
								height: PAPER_HEIGHT,
								position: 'relative',
							}}
						>
							<BaselineGrid
								width={PAPER_WIDTH}
								height={PAPER_HEIGHT}
								baseline={BASELINE_HEIGHT}
								{...theme.TypographicLayouts.baselineGrid}
								lineColor="#999"
								strokeWidth={3}
							/>
						</div>
					</div>
				</Sequence>

				<LorenzoBertoliniLogo color={theme.typography.textColor} />
			</div>
		</>
	);
};
