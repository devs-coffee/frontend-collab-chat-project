export interface profileUpdateForm {
    pseudo?: string,
    newPassword?: string,
    passwordConfirm?: string,
    oldPassword?: string,
    picture?: string | null,
    id?: string
}

export interface  profileUpdateFormErrors extends profileUpdateForm {}