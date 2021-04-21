//axios类

import {AxiosRequestConfig, AxiosResponse} from "./types";
import qs from 'qs'
import parseHeaders from 'parse-headers'//parse-headers没有@type/parse-header声明文件
export default class Axios {
    //T用来限制响应对象response里的data的类型
    request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.dispatchRequest(config)
    }

    //定义一个派发请求的方法
    dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return new Promise<AxiosResponse<T>>(function (resolve, reject) {
            let {method, url, params,headers,data} = config
            if (params && typeof params === 'object') {
                //使用qs对传入参数进行转换
                //{name:'zhufeng',password:'123456'} => name=zhufeng&password=123456
                params = qs.stringify(params)
            }
            //拿到请求的参数，将其附在url后面
            //两种情况：如果已经有问号，表示已存在参数，添加&即可
            //          如果没有问好，表示还没有问好，添加？
            url += ((url!.indexOf('?') !== -1 ? '&' : '?') + params)
            //创建XMLHTTPReques对象
            let request = new XMLHttpRequest()
            request.open(method!, url!, true)
            //告诉服务器希望接收的类型，希望接收的是一个对象
            request.responseType = 'json'
            request.onreadystatechange = function () { //指定一个状态变更函数
                if (request.readyState === 4) {
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
                    }else {
                        reject('请求失败')
                    }
                }
            }
            //处理请求头
            if (headers){
                for (let key in headers){
                    request.setRequestHeader(key,headers[key])
                }
            }
            //处理请求体
            let body : string | null = null
            if (data){
                body = JSON.stringify(data)
            }
            request.send(body) // 发送请求
        })
    }
}
