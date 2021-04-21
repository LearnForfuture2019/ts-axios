
interface OnFulfilled<V> {
    (value:V):V | Promise<V>
}
interface OnRejected {
    (error:any):any
}
export interface Interceptor<V> {
    onFulfilled?:OnFulfilled<V>//成功的回调
    onRejected?:OnRejected  //失败的回调
}

//T可能是AxiosRequestConfig，也可能是AxiosResponse
class InterceptorManager<V> {
    public interceptors:Array<Interceptor<V>| null > = []
    use(onFulfilled?:OnFulfilled<V>,onRejected?:OnRejected):number{
        this.interceptors.push({
            onFulfilled,
            onRejected
        })
        return this.interceptors.length-1 //返回当前拦截器在数组中的索引
    }
    eject(id:number){
        if (this.interceptors[id]){
            this.interceptors[id] = null
        }
    }
}

export default InterceptorManager
