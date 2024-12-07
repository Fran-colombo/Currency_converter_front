// import { UserRole } from "../enums/user-role";

import { UserRole } from "../enums/user-role";

export interface IUser {
        username: string,
        token: string,
        role : UserRole
}
