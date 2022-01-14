import { BuckyBehaviourModel } from "./bucky-behaviour-model";

export interface BuckyProfileModel {
    id: string,
    isMainProfile: boolean,
    behaviours: BuckyBehaviourModel[],
    name: string,
    description: string
 }
