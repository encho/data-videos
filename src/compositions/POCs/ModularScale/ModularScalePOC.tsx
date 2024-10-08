import {z} from 'zod';
import {useVideoConfig, Sequence} from 'remotion';

import LorenzoBertoliniLogo from '../../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../../acetti-themes/getThemeFromEnum';
import {FadeInAndOutText} from '../../SimpleStats/FadeInAndOutText';
import {BaselineGrid} from '../CapsizeTrimmingPOC/BaselineGrid';
import {useMatrixLayout} from '../../../acetti-layout/hooks/useMatrixLayout';
import {DisplayGridRails} from '../../../acetti-layout';
import {SlideTitle} from './SlideTitle';
// TODO factor out and deprecate it's second copy:
// import {ElementsLogo} from '../CapsizeTrimmingPOC/ElementsLogo';

export const modularScalePOCSchema = z.object({
	themeEnum: zThemeEnum,
});

export const ModularScalePOC: React.FC<
	z.infer<typeof modularScalePOCSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);
	const {fps} = useVideoConfig();

	const baseline = 14; // TODO funciton of width

	const paddingInBaselines = 2;
	const gutterInBaselines = 1;
	const cellHeightInBaselines = 16;

	const poster_height =
		(2 * paddingInBaselines +
			3 * gutterInBaselines +
			4 * cellHeightInBaselines) *
		baseline;

	const poster_width = poster_height * 0.62;

	const matrixLayout = useMatrixLayout({
		width: poster_width,
		height: poster_height,
		nrColumns: 4,
		nrRows: 4,
		columnSpacePixels: gutterInBaselines * baseline,
		rowSpacePixels: gutterInBaselines * baseline,
		rowPaddingPixels: paddingInBaselines * baseline,
		columnPaddingPixels: paddingInBaselines * baseline,
	});

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<SlideTitle theme={theme}>The Modular Scale</SlideTitle>
			<Sequence layout="none" from={fps * 1}>
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
					<div
						style={{
							width: poster_width,
							height: poster_height,
							position: 'relative',
						}}
					>
						<BaselineGrid
							width={poster_width}
							height={poster_height}
							baseline={baseline}
							stroke={'#777'}
							strokeWidth={3}
							fill="transparent"
						/>
						<DisplayGridRails {...matrixLayout} stroke={'orange'} />
					</div>
				</div>
			</Sequence>

			{/* <ElementsLogo cell_size={4} /> */}
			<LorenzoBertoliniLogo color={theme.typography.textColor} fontSize={34} />
		</div>
	);
};
