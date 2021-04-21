//用来定义各种类型
import Axios from "./Axios";
export type Methods = 'get'| 'GET' | 'post'|'POST'|'put'|'PUT'|'delete'|'DELETE'|'options'|'OPTIONS'|'post_status'|'post_timeout'

export interface AxiosRequestConfig {
    url?:string,
    method?:Methods,
    //Record<string,any>:代表的是一个对象，它的属性是字符串，属性是any
    params?:any,
    headers?:Record<string,any>, //请求头
    data?:Record<string,any>,//请求体
    timeout?:number
}
//指的是Axios.prototype.request这个方法
//Promise的泛型T代表此promise编程成功状态之后resolve的值  resolve(value)
export interface AxiosInstance {
    <T = any>(config:AxiosRequestConfig):Promise<AxiosResponse<T>>;
    //封装请求拦截器与响应拦截器
    interceptors:{
        request:AxiosInterceptorManager<AxiosRequestConfig>
        response:AxiosInterceptorManager<AxiosResponse>
    }
}
//泛型T代表响应体的类型
export interface AxiosResponse<T = any> {
    data:T
    status:number
    statusText:string
    headers?:Record<string, any>
    config?:AxiosRequestConfig
    request?:XMLHttpRequest

}
