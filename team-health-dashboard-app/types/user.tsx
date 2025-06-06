import { pulse } from "./Pulse";

export  interface User{
    user_id: number;
    username: string;
    password: string,
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

export interface MemberChart{
     user_id: number;
    username: string;
    password: string,
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    oncallTotal: number
    totalReviews: number
    pulse: number
}