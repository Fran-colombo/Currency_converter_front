import { EmailValidator } from "@angular/forms"
import { SubscriptionType } from "../enums/subscription-type"

export interface ISignUp {
        username: string
        password:string
        confirmPassword: string
        email: EmailValidator
        subscription: SubscriptionType
    }
    
    export interface IResSignUp {
        mensaje: string
    
}
