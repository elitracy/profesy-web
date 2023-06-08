import type { Course, Professor } from '../types';

export const searchCourses = async (
    course: string
): Promise<{ data: Course[] | null; status: number }> => {
    let uri = 'courses';
    const departmentAndNumber = course.match(/[a-zA-Z]+|[0-9]+/g);

    if (departmentAndNumber?.length === 1 && departmentAndNumber[0].match(/[a-zA-z]/g)) {
        // just name - CSCE - API only searches departments (name)
        uri += `/${departmentAndNumber[0]}`;
    } else if (departmentAndNumber?.length === 1 && !departmentAndNumber[0].match(/[a-zA-z]/g)) {
        // just number - 121 - return status 422
        return { data: null, status: 422 };
    } else if (
        departmentAndNumber?.length === 2 &&
        departmentAndNumber[0].match(/[a-zA-z]/g) &&
        departmentAndNumber[1].match(/[0-9]/g)
    ) {
        // both name and number - CSCE121 - API searches departments and numbers
        uri += `/${departmentAndNumber[0]}/${departmentAndNumber[1]}`;
    } else {
        // return status 422 - invalid input
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

export const getProfessorSemesters = async (professor: Professor | null, course: Course | null) => {
    if (!professor || !course) return { data: null, status: 400 };

    const response = await fetch(`http://localhost:3000/courses/professor/semesters`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ professor: professor.name, name: course.name, number: course.number })
    });

    return { data: await response.json(), status: response.status };
};
