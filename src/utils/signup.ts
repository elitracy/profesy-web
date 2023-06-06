import type { User } from '../types';
import { logged_in, current_user } from '../stores';
import bcrypt from 'bcryptjs';

export const checkPassword = (password: string, password_confirm: string) => {
    if (password.length < 8) {
        return {
            error: 'Password must be at least 8 characters.',
            data: null
        };
    }

    if (password !== password_confirm) {
        return {
            error: 'Passwords need to match.',
            data: null
        };
    }

    if (!/\d/.test(password)) {
        return {
            error: 'Passwords must contain at least one number.',
            data: null
        };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return {
            error: 'Passwords must contain at least one lowercase.',
            data: null
        };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return {
            error: 'Passwords must contain at least one uppercase.',
            data: null
        };
    }

    if (!/(?=.*\W)/.test(password)) {
        return {
            error: 'Passwords must contain at least one special character.',
            data: null
        };
    }

    return { error: null, data: password };
};

export const signUp = async (user: User) => {
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    return { data: await response.json(), status: response.status };
};

export const setSignInStores = async (user: User) => {
    logged_in.set(true);
    current_user.set(user);
};

export const signIn = async (usernameOrEmail: string, password: string) => {
    const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail })
    });

    // bad username or email
    if (response.status !== 200) {
        return { data: await response.json(), status: response.status };
    }

    const { data } = await response.json();

    return await bcrypt
        .compare(password, data.password)
        .then(async (compare_data) => {
            if (compare_data) return { data, status: response.status };
            else return { data: { error: 'Incorrect password.' }, status: 400 };
        })
        // password-hash comparison fails
        .catch(async (error) => {
            return { data: { error: 'Internal Server Error.' }, status: 400 };
        });
};

export const signOut = async () => {
    logged_in.set(false);
    current_user.set(null);
};
