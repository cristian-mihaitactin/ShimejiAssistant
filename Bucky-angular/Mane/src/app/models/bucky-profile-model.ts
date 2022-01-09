import { BuckyBehaviourModel } from "./bucky-behaviour-model";

export interface BuckyProfileModel {
    id: string,
    behaviours: BuckyBehaviourModel[],
    name: string,
    description: string
 }
