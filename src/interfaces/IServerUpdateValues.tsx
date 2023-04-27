export interface ServerUpdateValues {
    name?:string,
    picture?: string | null,
    categories?: string[]
}

export interface ServerUpdateFormErrors extends ServerUpdateValues {

}