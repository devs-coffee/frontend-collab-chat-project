export interface profileUpdateForm {
    pseudo?: string,
    newPassword?: string,
    newPasswordConfirm?: string,
    oldPassword?: string,
    image?: string
}

export interface  profileUpdateFormErrors extends profileUpdateForm {}