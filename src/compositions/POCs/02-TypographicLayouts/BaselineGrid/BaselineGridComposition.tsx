import {z} from 'zod';
import {Sequence, useVideoConfig} from 'remotion';

// TODO compare vs BaselineGrid in typography package
// TODO deprecate/ replace BaselineGrid in typography package
import {BaselineGrid} from './BaselineGrid';
import {useFontFamiliesLoader} from '../../../../acetti-typography/useFontFamiliesLoader';
import LorenzoBertoliniLogo from '../../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../../acetti-themes/getThemeFromEnum';
import {ElementsLogo} from './ElementsLogo';
import {CapSizeTextNew} from './CapSizeTextNew';
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
	useFontFamiliesLoader(['Inter-Regular']);
	const theme = getThemeFromEnum(themeEnum as any);

	const {fps} = useVideoConfig();

	const BASELINE_HEIGHT = 18;
	const NR_LINES = 34;
	const PAPER_WIDTH = 800;
	const PAPER_HEIGHT = NR_LINES * BASELINE_HEIGHT;
	const LINEGAP = BASELINE_HEIGHT * 1;

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
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
					<div style={{display: 'flex', gap: 40}}>
						<div
							style={{
								width: PAPER_WIDTH,
								height: PAPER_HEIGHT,
								position: 'relative',
								// borderRadius: 5,
								// overflow: 'hidden',
							}}
						>
							<BaselineGrid
								width={PAPER_WIDTH}
								height={PAPER_HEIGHT}
								baseline={BASELINE_HEIGHT}
								{...theme.TypographicLayouts.baselineGrid}
								strokeWidth={3}
							/>

							<Sequence from={fps * 2}>
								<div
									style={{
										display: 'flex',
										gap: 2 * LINEGAP,
										flexDirection: 'column',
									}}
								>
									<CapSizeTextNew
										fontFamily="Inter"
										fontWeight={100}
										capHeight={BASELINE_HEIGHT * 2}
										lineGap={BASELINE_HEIGHT}
										color="white"
									>
										{/* <FadeInAndOutText> */}
										The quick brown fox jumps over the lazy dog. As dawn breaks,
										the sun shines with a soft, golden glow. In the distance,
										birds chirp harmoniously, their melodies echoing through the
										crisp air. The breeze carries the scent of fresh pine,
										intertwining with the sweet aroma of blooming flowers.
										Slowly, the town wakes up, the sound of footsteps and
										chatter filling the streets.
										{/* </FadeInAndOutText> */}
									</CapSizeTextNew>
								</div>
							</Sequence>
						</div>
					</div>
				</div>

				{/* <ElementsLogo cell_size={4} /> */}
				<LorenzoBertoliniLogo
					color={theme.typography.textColor}
					fontSize={34}
				/>
			</div>
		</>
	);
};
