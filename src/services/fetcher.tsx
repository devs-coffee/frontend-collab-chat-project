import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { OperationResult } from "../interfaces/IOperationResult";

export abstract class Fetcher {
    private axiosInstance = axios.create();
    private host = 'http://codevert.org:4200';
    private readonly token = localStorage.getItem('access_token');

    constructor() {
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
    

    async get<T>(url: string, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<T>>> {
        const response = await this.axiosInstance.get(this.host + url, config);
        return response;
    }
    async post<T, U>(url: string, body?:T, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<U>>> {
        const response = await this.axiosInstance.post(this.host + url, body, config);
        return response;
    }
    async put<T, U>(url: string, body?:T, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<U>>> {
        const response = await this.axiosInstance.put(this.host + url, body, config);
        return response;
    }
    async delete<T>(url: string, config?: AxiosRequestConfig<T>):Promise<AxiosResponse<OperationResult<T>>> {
        const response = await this.axiosInstance.delete(this.host + url, config);
        return response;
    }
}