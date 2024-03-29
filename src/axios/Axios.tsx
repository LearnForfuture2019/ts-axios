//axios类
import AxiosInterceptorManager, {Interceptor} from "./AxiosInterceptorManager";
import {AxiosRequestConfig, AxiosResponse} from "./types";
import qs from 'qs'
import parseHeaders from 'parse-headers'//parse-headers没有@type/parse-header声明文件
export default class Axios<T> {

    public interceptors = {
        request: new AxiosInterceptorManager<AxiosRequestConfig>(),
        response: new AxiosInterceptorManager<AxiosResponse<T>>()
    }

    //T用来限制响应对象response里的data的类型
    request(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        // return this.dispatchRequest(config)
        const chain: Interceptor<AxiosRequestConfig | AxiosResponse<T>>[] = [
            {
                onFulfilled: this.dispatchRequest,
            }
        ]
        //将请求拦截器放入chain里
        this.interceptors.request.interceptors.forEach((interceptor:Interceptor<AxiosRequestConfig | AxiosResponse<T>)=>{
            interceptor && chain.unshift(interceptor)
        })
    }

    //定义一个派发请求的方法
    dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return new Promise<AxiosResponse<T>>(function (resolve, reject) {
            let {method, url, params, headers, data, timeout} = config
            if (params) {
                //使用qs对传入参数进行转换
                //{name:'zhufeng',password:'123456'} => name=zhufeng&password=123456
                params = qs.stringify(params)
                //拿到请求的参数，将其附在url后面
                //两种情况：如果已经有问号，表示已存在参数，添加&即可
                //          如果没有问好，表示还没有问好，添加？
                url += ((url!.indexOf('?') !== -1 ? '&' : '?') + params)
            }

            //创建XMLHTTPReques对象
            let request = new XMLHttpRequest()
            request.open(method!, url!, true)
            //告诉服务器希望接收的类型，希望接收的是一个对象
            request.responseType = 'json'
            request.onreadystatechange = function () { //指定一个状态变更函数
                if (request.readyState === 4 && request.status !== 0) {
                    if (request.status >= 200 && request.status < 300) {


                        let response: AxiosResponse<T> = {
                            data: request.response ? request.response : request.responseText,
                            status: request.status,
                            statusText: request.statusText,
                            /*
                            * request.getAllResponseHeaders()返回格式为：
                            *  content-type = xxx; content-length=42
                            * 通过parse-headers将其转换为对象：
                            * {content-type:xxx,content-length:42}
                            * */
                            headers: parseHeaders(request.getAllResponseHeaders()),
                            config,
                            request
                        }
                        resolve(response)
                    } else {
                        reject(`Error:Request failed with status code ${request.status}`)
                    }
                }
            }
            //处理请求头
            if (headers) {
                for (let key in headers) {
                    request.setRequestHeader(key, headers[key])
                }
            }
            //处理请求体
            let body: string | null = null
            if (data) {
                body = JSON.stringify(data)
            }
            //onerror处理响应失败的请求
            request.onerror = function () {
                reject('net::ERR_INTERNET_DISCONNECTED')
            }
            //处理超时响应失败的问题
            if (timeout) {
                request.timeout = timeout
                request.ontimeout = function () {
                    reject(`Error:timout of ${timeout}ms exceeded`)
                }
            }
            request.send(body) // 发送请求
        })
    }
}
