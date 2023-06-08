<script lang="ts">
	import { searchCourses, getProfessorSemesters } from '../../utils/courses';
	import { getProfessorById } from '../../utils/professors';
	import type { Course, Professor } from '../../types';

	// API-state helper functions
	const createUniqueCourseList = (courseList: Course[]) => {
		const uniqueCoursesMap = courseList.reduce((map, obj) => {
			const key = obj.name + '-' + obj.number;
			if (!map.has(key)) {
				map.set(key, obj);
			}
			return map;
		}, new Map());

		const uniqueCourses = Array.from(uniqueCoursesMap.values());
		return uniqueCourses;
	};

	const createUniqueProfessorList = async (
		courseList: Course[] | null
	): Promise<(Professor | null)[]> => {
		if (!courseList) return [];
		const uniqueProfessorIds = Array.from(new Set(courseList.map((course) => course.professorId)));

		let uniqueProfessors = await Promise.all(
			uniqueProfessorIds.map(async (profId) => {
				const { data, status } = await getProfessorById(profId);
				return data && status === 200 ? data : null;
			})
		);

		uniqueProfessors = uniqueProfessors.filter((prof) => prof !== null);

		return uniqueProfessors;
	};

	const createSemesterList = async (professor: Professor | null, course: Course | null) => {
		const { data, status } = await getProfessorSemesters(professor, course);
		return data && status === 200 ? data : [];
	};

	// state
	let courseSearchInput: string = '';
	let courses: Course[] = [];
	let selectedCourse: Course | null;

	let professors: (Professor | null)[] = [];
	let selectedProfessor: Professor | null;

	let semesters: Course[] = [];
</script>

<h1>Hello from Courses</h1>

{#if selectedCourse}
	<p>Selected Course: {selectedCourse.name + selectedCourse.number}</p>
{/if}

{#if selectedProfessor}
	<p>Selected Professor: {selectedProfessor.name}</p>
{/if}

<input
	type="text"
	placeholder="Search Courses"
	bind:value={courseSearchInput}
	on:input={async () => {
		professors = [];
		let { data, status } = await searchCourses(courseSearchInput);
		if (status === 200 && data) {
			courses = createUniqueCourseList(data);
		}
	}}
	class="border-black border-2 rounded-lg p-1"
/>

{#each courses as course}
	<button
		on:click={async () => {
			selectedCourse = course;
			professors = [];

			let { data } = await searchCourses(selectedCourse.name + selectedCourse.number);
			professors = await createUniqueProfessorList(data);
		}}
	>
		{course.name}
		{course.number}
	</button>
{/each}

{#if courseSearchInput.length && !courses.length}
	<p>No courses found.</p>
{/if}

{#each professors as professor}
	{#if professor}
		<button
			on:click={async () => {
				selectedProfessor = professor;
				semesters = await createSemesterList(selectedProfessor, selectedCourse);
			}}>{professor.name}</button
		>
	{/if}
{/each}

{#each semesters as semester}
	<p>{JSON.stringify(semester, null, 2)}</p>
{/each}
