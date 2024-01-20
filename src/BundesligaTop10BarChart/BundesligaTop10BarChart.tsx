import {z} from 'zod';
import {HorizontalBarsStar} from '../HorizontalBarsStar/HorizontalBarsStar';

const COLORS = {
	background: '#1c2541',
	text: '#CAD8DE',
	placements: {
		champions: '#76E7CD',
		uefa: '#9B7EDE',
		uefaConference: '#C45BAA',
	},
};

export const bundesligaTop10BarChartSchema = z.object({
	year: z.number(),
	dateString: z.string(),
	apiData: z
		.array(
			z.object({
				teamName: z.string(),
				points: z.number(),
				matches: z.number(),
				teamIconUrl: z.string(),
			})
		)
		.nullable(),
});

export const BundesligaTop10BarChart: React.FC<
	z.infer<typeof bundesligaTop10BarChartSchema>
> = ({apiData, dateString, year}) => {
	// TODO use tiny-invariant
	if (apiData === null) {
		throw new Error('Data was not fetched');
	}

	const horizontalBarsStartDataItems = apiData
		.filter((_it, i) => i < 10)
		.map((it, i) => {
			return {
				label: it.teamName,
				description: `${it.points} Punkte`,
				value: it.points,
				colors: {
					background: COLORS.background,
					text: COLORS.text,
					border:
						i < 4
							? COLORS.placements.champions
							: i === 4
							? COLORS.placements.uefa
							: i === 5
							? COLORS.placements.uefaConference
							: 'transparent',
				},
				imageSource: it.teamIconUrl,
			};
		});

	const horizontalBarsStarProps = {
		titleText: `Top 10 Bundesliga Teams | ${dateString}`,
		titleFontSize: 44,
		titleColor: '#CAD8DE',
		backgroundColor: '#0b132b',
		progressColor: '#CAD8DE',
		items: horizontalBarsStartDataItems,
	};

	return <HorizontalBarsStar {...horizontalBarsStarProps} />;
};
