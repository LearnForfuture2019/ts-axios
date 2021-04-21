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
    password:'123456'
}
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
axios({
    method:'post',
    url:baseUrl+'/post',
    headers:{
        'content-type':'application/json'
    },
    data:user //查询参数对象
}).then((response)=>{
    console.log(response)
}).catch((e:any)=>{
    console.log(e)
})
