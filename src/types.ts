export type User = {
	name: string;
	username: string;
	password: string;
	email: string;
};

export type Course = {
	name: string;
	number: string;
	professorId: string;
	season: string;
	year: number;
	A: number;
	B: number;
	C: number;
	D: number;
	F: number;
	Q: number;
};

export type Professor = {
	name: string;
};
