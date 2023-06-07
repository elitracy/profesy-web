<script lang="ts">
	import { searchCourses } from '../../utils/courses';
	import type { Course } from '../../types';

	let courseSearchInput = '';
	let courses: Course[] = [];

	const createUniqueCourseList = (courseList: Course[]) => {
		const uniqueCoursesStrings = new Set(
			courseList.map((course) => `${course.name}-${course.number}`)
		);
		const uniqueCourses = Array.from(uniqueCoursesStrings).map((course) => {
			const [name, number] = course.split('-');
			return { name, number };
		});

		return uniqueCourses;
	};
</script>

<h1>Hello from Courses</h1>

<input
	type="text"
	placeholder="Search Courses"
	bind:value={courseSearchInput}
	on:input={async () => {
		let { data, status } = await searchCourses(courseSearchInput);
		if (status === 200 && data) {
			courses = createUniqueCourseList(data);
		}
	}}
	class="border-black border-2 rounded-lg p-1"
/>

{#each courses as course}
	<p>{course.name} {course.number}</p>
{/each}

{#if courseSearchInput.length && !courses.length}
	<p>No courses found.</p>
{/if}
