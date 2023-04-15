export interface Server {
    id: string,
    name: string,
    picture?: string,
    isPrivate: boolean,
    categories: string[],
    isCurrentUserAdmin: boolean
}