
//User model
export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    avatarUrl: string;
}

export interface Users {
    [key: number]: User;
}

