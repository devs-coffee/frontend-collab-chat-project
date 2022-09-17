export interface reduxData {
    authStatus: {
        isLogged: boolean,
        user: string | null,
        token: string | null
    }
}