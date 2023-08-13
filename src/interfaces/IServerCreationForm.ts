export interface serverCreationForm {
    name:string,
    picture?: string,
    categories: string[] | null
}

export interface serverCreationFormErrors {
    name?: string,
    picture?: string,
}