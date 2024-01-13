import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

const api = axios.create();

/* const getQuery = <R>(path: string, paramObject: Record<string, string | number | null>, options: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        return axios.get(path, options).then(
            (resp: AxiosResponse<R>) => {
                resolve(resp);
            },
            (err: Error) => {
                return reject(err);
            }
        );
    });
};

const putQuery = <T, R>(path: string, data: T, options: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        return axios.put(path, data, options).then(
            (resp: AxiosResponse<R>) => {
                resolve(resp);
            },
            (err: Error) => {
                return reject(err);
            }
        );
    });
};

const postQuery = <T, R>(path: string, data: T, options: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        return axios.post(path, data, options).then(
            (resp: AxiosResponse<R>) => {
                resolve(resp);
            },
            (err: Error) => {
                return reject(err);
            }
        );
    });
};

const deleteQuery = <R>(path: string, paramObject: Record<string, string | number | null>, options: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        return axios.delete(path, options).then(
            (resp: AxiosResponse<R>) => {
                resolve(resp);
            },
            (err: Error) => {
                return reject(err);
            }
        );
    });
}; */

export { api, axios };
