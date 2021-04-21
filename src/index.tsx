import axios,{AxiosResponse,AxiosRequestConfig} from './axios/index'
//基本url
const baseUrl = 'http://localhost:8080'
//定义一个接口user：这里指的是服务器返回的对象
//接口是只声明成员方法，而不做实现
interface User {
    name:string,
    password:string
}
let user:User = {
    name:'zhufeng',
    password:'12387456'
}

//请求拦截器:先添加后执行（栈）
axios.interceptors.request.use((config:AxiosRequestConfig) : AxiosRequestConfig=>{
    config.headers&&config.headers.name == '1'
    return config
},(err:any) => Promise.reject(err))
//响应拦截器：先添加先执行（队列）
axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
    response.data.name  += '3'
    return response
})
//利用axios对象：返回一个promise
//封装的get请求
/*axios({
    method:'get',//方法名
    url:baseUrl + '/get',//访问路径
    params:user //查询参数对象，它会转成查询字符串放在？后面
}).then((response:AxiosResponse<User>) =>{
    console.log(response)
    return response.data
}).catch((e:any) =>{
    console.log(e)
})*/
//封装post请求
axios<User>({
    method:'post',
    url:baseUrl+'/post_timeout?timeout=2000',
    headers:{
        'content-type':'application/json',
        "name":'zhufeng'
    },
    data:user, //查询参数对象,
    timeout:1000 // 超时时间
}).then((response:AxiosResponse<User>)=>{
    console.log(response)
    console.log(response.data)
}).catch((e:any)=>{
    console.log(e)
})
