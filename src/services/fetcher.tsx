import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { OperationResult } from "../interfaces/IOperationResult";

export abstract class Fetcher {
    constructor(){
        this.initializeRequestInterceptors();
        // TODO : this.initializeResponseInterceptor();
    }

    private initializeRequestInterceptors = () => {
        axios.interceptors.request.use(
            this.handleRequest,
            this.handleError
        )
    }

    // TODO :
    // private initializeResponseInterceptors = () => {
    //     axios.interceptors.response.use(
    //         this.handleResponse,
    //         this.handleError
    //     )
    // }

    private handleRequest = (config:AxiosRequestConfig) => {
        if(this.token){
            config.headers = {
                'Authorization': `Bearer ${this.token}`,
                ...config.headers ?? {}
            }
        }
        return config;
    }

    // TODO
    // private handleResponse = (response: any) => {
    //     return response;
    // }

    private handleError = (error: any) => Promise.reject(error);
    // TODO
    // private handleError = (error:any) => {
    //     if(error instanceof AxiosError) {
    //         throw new Error(error.response?.data.message);
    //     }
    //     else {
    //         throw new Error("Une erreur est survenue, veuillez réessayer");
    //     }
    // }
    
    private readonly token = localStorage.getItem('access_token');

    async get<T>(url: string, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<T>>> {
        const response = await axios.get(url, config);
        return response;
    }
    async post<T, U>(url: string, body?:T, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<U>>> {
        const response = await axios.post(url, body, config);
        return response;
    }
    async put<T, U>(url: string, body?:T, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<U>>> {
        const response = await axios.put(url, body, config);
        return response;
    }
    async delete<T>(url: string, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<T>>> {
        const response = await axios.delete(url, config);
        return response;
    }
}