import { SubscriptionType } from "../enums/subscription-type";

export interface ISubscription {
    subId: number;
    subscriptionType: SubscriptionType;
    maxConversions: number;
}
