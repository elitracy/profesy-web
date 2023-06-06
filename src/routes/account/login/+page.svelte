<script lang="ts">
	import { goto } from '$app/navigation';
	import { setSignInStores, signIn } from '../../../utils/signup';

	let usernameOrEmail: string;
	let password: string;
	let errorMessage: string | null;
</script>

<div class="w-full">
	<h1 class="text-center text-3xl">Log In</h1>
	<div class="flex flex-col justify-center items-center w-full mx-auto">
		<h1>Username</h1>
		<input type="text" name="username" class="text-black" bind:value={usernameOrEmail} />

		<h1>Password</h1>
		<input type="text" name="password" class="text-black" bind:value={password} />
		<button
			on:click={() => {
				signIn(usernameOrEmail, password).then(({ data, status }) => {
					// const { username, name, password, email } = data;
					if (status === 200) {
						setSignInStores(data);
						goto('/account');
					} else errorMessage = data.error;
				});
			}}
		>
			Submit
		</button>

		{#if errorMessage}
			<p class="text-red-400">{errorMessage}</p>
		{/if}

		<p class="text-gray-400">Don't have an account?</p>
		<a href="/account/signup">Join today!</a>
	</div>
</div>
