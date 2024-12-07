import { EmailValidator } from "@angular/forms"
import { ISubscription } from "./isubscription"
import { UserRole } from "../enums/user-role"

export interface IUserToShow {
    username: string,
    email: EmailValidator,
    subscription: ISubscription, 
    conversions: number,
    role: UserRole
}
