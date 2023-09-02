import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { OperationResult } from "../interfaces/IOperationResult";

export abstract class Fetcher {
    private axiosInstance = axios.create();
    private readonly token = localStorage.getItem('access_token');
    private host = process.env.REACT_APP_BACKEND_HOST

    constructor() {
        this.initializeRequestInterceptors();
        this.initializeResponseInterceptors();
    }

    private initializeRequestInterceptors = () => {
        this.axiosInstance.interceptors.request.use(
            this.handleRequest,
            this.handleError
        )
    }

    private initializeResponseInterceptors = () => {
        this.axiosInstance.interceptors.response.use(
            this.handleResponse,
            this.handleError
        )
    }

    private handleRequest = (config:AxiosRequestConfig) => {
        if(this.token){
            config.headers = {
                'Authorization': `Bearer ${this.token}`,
                ...config.headers ?? {}
            }
        }
        return config;
    }

    private handleResponse = (response: any) => {
        return response;
    }

    private handleError = (error: Error) => {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Une erreur est survenue, veuillez réessayer");
        }
    }
    

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