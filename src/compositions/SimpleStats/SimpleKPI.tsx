import {z} from 'zod';

import LorenzoBertoliniLogo from '../../acetti-components/LorenzoBertoliniLogo';
import {
	getThemeFromEnum,
	zThemeEnum,
} from '../../acetti-themes/getThemeFromEnum';

export const simpleKPICompositionSchema = z.object({
	themeEnum: zThemeEnum,
});

export const SimpleKPIComposition: React.FC<
	z.infer<typeof simpleKPICompositionSchema>
> = ({themeEnum}) => {
	const theme = getThemeFromEnum(themeEnum as any);

	return (
		<div
			style={{
				backgroundColor: theme.global.backgroundColor,
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<LorenzoBertoliniLogo color={theme.typography.textColor} />
		</div>
	);
};
