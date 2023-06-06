<script lang="ts">
	import type { User } from '../../types';
	import { current_user } from '../../stores';
	import { signOut } from '../../utils/signup';

	let currentUserValue: User | null;

	current_user.subscribe((user) => {
		currentUserValue = user;
	});
</script>

<h1 class="text-xl font-semibold text-center m-10">Account</h1>

{#if currentUserValue}
	<h1>Hello {currentUserValue.name}!</h1>
	<button on:click={signOut}>Log Out</button>
{:else}
	<a href="/account/login">Log In</a>
	<a href="/account/signup">Sign Up</a>
{/if}
