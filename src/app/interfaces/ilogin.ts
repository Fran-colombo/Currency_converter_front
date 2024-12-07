import { UserRole } from "../enums/user-role"

export interface ILogin{
    Username: string
    Password:string
}

export interface IResLogin {
    token?: string
    role?: UserRole
}