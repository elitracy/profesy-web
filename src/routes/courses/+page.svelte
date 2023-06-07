<script lang="ts">
	import { searchCourses } from '../../utils/courses';
	import { getProfessorById } from '../../utils/professors';
	import type { Course, Professor } from '../../types';

	let courseSearchInput: string = '';
	let courses: Course[] = [];
	let selectedCourse: Course | null;

	let professors: (Professor | null)[] = [];
	// let selectedProfessor: Course | null;

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
</script>

<h1>Hello from Courses</h1>

{#if selectedCourse}
	<p>Selected Course: {selectedCourse.name + selectedCourse.number}</p>
{/if}

<input
	type="text"
	placeholder="Search Courses"
	bind:value={courseSearchInput}
	on:input={async () => {
		let { data, status } = await searchCourses(courseSearchInput);
		console.log(data);
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
			console.log(professors);
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
		<p>{professor.name}</p>
	{/if}
{/each}
