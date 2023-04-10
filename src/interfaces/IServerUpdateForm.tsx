export interface serverUpdateForm {
    name?:string,
    picture?: string | null,
    categories?: string[]
}

export interface serverUpdateFormErrors extends serverUpdateForm {

}