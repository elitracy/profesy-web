import { writable } from 'svelte/store';
import type { User } from './types';

export const current_page = writable('home');
export const logged_in = writable(false);
export const current_user = writable<User | null>(null);
