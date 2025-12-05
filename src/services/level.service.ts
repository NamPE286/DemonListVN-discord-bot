export interface Level {
	id: number;
	name: string;
	creator: string;
	videoID: string;
	minProgress: number;
	flTop: number | null;
	dlTop: number;
	flPt: number | null;
	rating: number;
	created_at: string;
	isPlatformer: boolean;
	insaneTier: number | null;
	accepted: boolean;
	isNonList: boolean;
	record: any;
}

export async function fetchList(listType: string, start: number, end: number): Promise<Level[]> {
	const response = await fetch(
		`${process.env.API_URL}/list/${listType}?start=${start}&end=${end}&sortBy=${listType}Top&ascending=true`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch list');
	}
	return (await response.json()) as Level[];
}
