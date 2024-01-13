import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { axios } from '../boot/axios';

export type InterceptorResponse<T> = (req: AxiosResponse<T>) => T | undefined | AxiosResponse<T>;
export type InterceptorRequest<T> = (req: AxiosRequestConfig) => AxiosRequestConfig;

export interface Interceptors<T> {
    putRequestInterceptor?: InterceptorRequest<T>;
    putResponseInterceptor?: InterceptorResponse<T>;
    getResponseInterceptor?: InterceptorResponse<T>;
    postRequestInterceptor?: InterceptorRequest<T>;
    postResponseInterceptor?: InterceptorResponse<T>;
    deleteResponseInterceptor?: InterceptorResponse<T>;
}

export interface AbstractResourceApiClass<T> {
    basePath: string;
    xid: string;
    options: Interceptors<T>;
    /*
    save:  (data: Partial<T>) => Promise<T | AxiosResponse<T, any> | undefined>;
    update: (data: Partial<T>) => Promise<T | AxiosResponse<T, any> | undefined> ;
    get: () => Promise<T | AxiosResponse<T, any> | undefined> ;
    delete: () => Promise<T | AxiosResponse<T, any> | undefined> ;
*/
}

abstract class AbstractResourceApi<T> implements AbstractResourceApiClass<T> {
    basePath = '';
    options: Interceptors<T> = {};
    xid = '';
    construct(basePath: string, options: Interceptors<T>, xid = '') {
        this.basePath = basePath;
        this.options = options;

        this.xid = xid; // Either '' or DP_.... etc
    }

    protected get = async () => {
        const resp: AxiosResponse<T> | AxiosError<T> = await axios.get<T>(this.basePath);
        if ((resp as AxiosResponse<T>).data) {
            if (this.options.getResponseInterceptor) {
                return this.options.getResponseInterceptor((resp as AxiosResponse).data);
            }
            return resp.data;
        } else {
            throw resp;
        }
    };

    protected save = async (d: Partial<T>) => {
        if (this.options.postRequestInterceptor) {
            const { url, data, headers } = this.options.postRequestInterceptor(d);
            d = data;
        }
        const resp: AxiosResponse<T> | AxiosError<T> = await axios.post<T>(this.basePath, d);
        if ((resp as AxiosResponse<T>).data) {
            if (this.options.postResponseInterceptor) {
                return this.options.postResponseInterceptor((resp as AxiosResponse).data);
            }
            return resp.data;
        } else {
            throw resp;
        }
    };

    protected update = async (d: Partial<T>) => {
        if (this.options.putRequestInterceptor) {
            const { url, data, headers } = this.options.putRequestInterceptor(d);
            d = data;
        }
        const resp: AxiosResponse<T> | AxiosError<T> = await axios.post<T>(this.basePath, d);
        if ((resp as AxiosResponse<T>).data) {
            if (this.options.putResponseInterceptor) {
                return this.options.putResponseInterceptor((resp as AxiosResponse).data);
            }
            return resp.data;
        } else {
            throw resp;
        }
    };

    protected delete = async () => {
        const resp: AxiosResponse<T> | AxiosError<T> = await axios.get<T>(this.basePath);
        if ((resp as AxiosResponse<T>).data) {
            if (this.options.deleteResponseInterceptor) {
                return this.options.deleteResponseInterceptor((resp as AxiosResponse).data);
            }
            return resp.data;
        } else {
            throw resp;
        }
    };
}

export default AbstractResourceApi;
