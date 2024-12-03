import {TBundesLigaTabelleCompositionSchema} from './BundesligaTabelleComposition';

export const calculateMetadata = async ({
	props,
}: {
	props: TBundesLigaTabelleCompositionSchema;
}) => {
	const year = 2024;
	const apiUrl = `https://api.openligadb.de/getbltable/bl1/${year}`;
	const data = await fetch(apiUrl);
	const json = (await data.json()) as {
		teamName: string;
		points: number;
		teamInfoId: number;
		teamIconUrl: string;
	}[];

	const parsedData = json.map((it) => ({
		teamIconUrl: it.teamIconUrl,
		label: it.teamName,
		value: it.points,
		id: `id-${it.teamInfoId}`,
	}));

	const formatGermanDate = (date: Date): string => {
		return new Intl.DateTimeFormat('de-DE', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(date);
	};

	const today = new Date();
	const formattedDate = formatGermanDate(today);

	return {
		props: {
			...props,
			data: parsedData,
			subtitle: `Punktestand am ${formattedDate}`,
		},
	};
};
