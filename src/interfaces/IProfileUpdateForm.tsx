export interface profileUpdateForm {
    pseudo?: string,
    password?: string,
    passwordConfirm?: string,
    oldPassword?: string,
    picture?: string,
    id?: string
}

export interface  profileUpdateFormErrors extends profileUpdateForm {}