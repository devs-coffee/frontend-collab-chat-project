import { ObjectType } from "typescript";

export interface reduxAction {
    type: string,
    payload?: ObjectType
}