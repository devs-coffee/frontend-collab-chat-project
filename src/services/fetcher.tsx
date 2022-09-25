import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { OperationResult } from "../interfaces/IOperationResult";



export class Fetcher {
    private readonly token = localStorage.getItem('access_token');
    async get<T>(url: string, isProtected=true):Promise<AxiosResponse<OperationResult<T>>> {
        // try {
        //     const response = await axios.get(url, config);
        //     return response;
        // } catch (error) {
        //     console.log(error);
        //     return Promise.resolve({errorMessage: 'echec', result: null, isSucceed: false});
        // }
        let config:AxiosRequestConfig = {};
        if(isProtected) {
            //config.headers.Authorization = 'Bearer ${this.token}';
            config = {headers: {'Authorization': `Bearer ${this.token}`}}
        }
        
        const response = await axios.get(url, config);
        return response;
    }
    post() {

    }

}