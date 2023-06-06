<script lang="ts">
	import { logged_in, current_user } from '../../../stores';
	import { checkPassword, signUp, setSignInStores } from '../../../utils/signup';
	import bcrypt from 'bcryptjs';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let loggedInValue: boolean;
	let entryError: string | null;
	let name: string = '';
	let email: string = '';
	let username: string = '';
	let password: string = '';
	let confirmPassword: string = '';

	logged_in.subscribe((logged_in) => {
		loggedInValue = logged_in;
	});
</script>

<div class="w-full">
	<h1 class="text-center text-3xl">Create Account</h1>
	<div class="flex flex-col justify-center items-center w-full mx-auto">
		<h1 class="w-fit text-left">Name</h1>
		<input type="text" name="name" class="text-black" bind:value={name} />

		<h1>Username</h1>
		<input type="text" name="username" class="text-black" bind:value={username} />

		<h1>Email</h1>
		<input type="text" name="email" class="text-black" bind:value={email} />

		<h1>Password</h1>
		<input type="text" name="password" class="text-black" bind:value={password} />

		<h1>Confirm Password</h1>
		<input type="text" name="password_confirm" class="text-black" bind:value={confirmPassword} />

		<button
			on:click={async () => {
				const { error } = checkPassword(password, confirmPassword);
				entryError = error ? error : null;

				if (!error) {
					const password_salt = await bcrypt.genSalt(10);
					const password_hash = await bcrypt.hash(password, password_salt);

					signUp({ name, email, username, password: password_hash }).then(
						async ({ data, status }) => {
							if (status == 400) entryError = data.error;
							else {
								await setSignInStores({ name, email, username, password });
								goto('/account');
							}
						}
					);
				}
			}}
		>
			Submit
		</button>

		{#if entryError}
			<p class="text-red-400">{entryError}</p>
		{/if}
	</div>
</div>
