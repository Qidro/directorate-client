import axios from "axios";

const DEV_URL = 'https://project.usma.ru/api'
const PRODUCTION_URL = 'https://project.usma.ru/api'

export const API_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEV_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Disposition': '*'
    }
})

const request = {
    getBlob: <T>(url: string) => api.get<T>(url, {responseType: "blob"}),
    get: <T>(url: string) => api.get<T>(url),
    post: <T>(url: string, data?: object) => api.post<T>(url, data),
    delete: <T>(url: string, data?: object) => api.delete<T>(url, {data: data})
}

export default request;