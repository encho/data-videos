import {z} from 'zod';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
// import {DisplayGridRails, Area} from '../../../acetti-layout';

// import {
// 	useMatrixLayout,
// 	getMatrixLayoutCellArea,
// } from '../../../acetti-layout/hooks/useMatrixLayout';
import {ElementsLogo} from './ElementsLogo';
// import {SilkscreenLetter} from './SilkscreenLetter';

export const capsizeTrimmingPOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const CapsizeTrimmingPOC: React.FC<
	z.infer<typeof capsizeTrimmingPOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	const BASELINE_HEIGHT = 40;
	const NR_LINES = 16;

	const PAPER_WIDTH = 800;
	const PAPER_HEIGHT = NR_LINES * BASELINE_HEIGHT;

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<div style={{position: 'relative'}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							color: theme.typography.title.color,
							fontSize: 80,
							marginTop: 110,
							fontWeight: 700,
						}}
					>
						Capsize Trimming
					</div>
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
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

					<div style={{color: 'white', fontSize: BASELINE_HEIGHT}}>
						This font is {BASELINE_HEIGHT} large
					</div>
					<div style={{color: 'white', fontSize: BASELINE_HEIGHT}}>
						The quick brown fox jumps over the lazy dog.
					</div>
				</div>
			</div>

			<ElementsLogo cell_size={5} />
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
