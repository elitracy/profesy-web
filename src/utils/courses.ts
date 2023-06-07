import type { Course } from '../types';
export const searchCourses = async (
	course: string
): Promise<{ data: Course[] | null; status: number }> => {
	let uri = 'courses';
	const departmentAndNumber = course.match(/[a-zA-Z]+|[0-9]+/g);
	if (departmentAndNumber?.length === 1 && departmentAndNumber[0].match(/[a-zA-z]/g)) {
		// CSCE
		uri += `/${departmentAndNumber[0]}`;
	} else if (departmentAndNumber?.length === 1 && !departmentAndNumber[0].match(/[a-zA-z]/g)) {
		// 121 - return status 422
		return { data: null, status: 422 };
	} else if (
		// CSCE121
		departmentAndNumber?.length === 2 &&
		departmentAndNumber[0].match(/[a-zA-z]/g) &&
		departmentAndNumber[1].match(/[0-9]/g)
	) {
		uri += `/${departmentAndNumber[0]}/${departmentAndNumber[1]}`;
	} else {
		// return status 422
		return { data: null, status: 422 };
	}
	const response = await fetch(`http://localhost:3000/${uri}`, {
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
