import type { Professor } from '../types';

export const getProfessorById = async (
	professorId: string
): Promise<{ data: Professor; status: number }> => {
	const response = await fetch(`http://localhost:3000/professors/id/${professorId}`, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return { data: await response.json(), status: response.status };
};
