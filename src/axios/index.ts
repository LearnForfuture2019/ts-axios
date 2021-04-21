import Axios from "./Axios";
import {AxiosInstance} from './types'
//可以创建一个axios的实例，axios其实就是一个函数
//定义一个类的时候，一个类的原型：Axiois.prototype ；一个类的实例
function createInstance():AxiosInstance {
    let context:Axios = new Axios() //this指向上下文
    //让request方法里的this永远指向context也就是new Axios()
    let instance = Axios.prototype.request.bind(context)
    //这一步是将Axios.prototype以及context上的所有属性，拷贝到instance上
    //Object.assign()
    // 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
    // 它将返回目标对象。
    instance = Object.assign(instance, Axios.prototype, context)
    return instance as AxiosInstance
}

let axios = createInstance()
export default axios

export * from './types'
