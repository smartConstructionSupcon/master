import axios from 'axios'
import {getStore, removeStore} from '@/utils/storage'
import { Toast } from 'vant'
import Vue from 'vue'
Vue.use(Toast)
import router from '../router/index'


// 设置通用host 前缀
const HOST = '/api'
var token = ''
let http = axios.create({
  // baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  transformRequest: [function (data) {
    // TODO data transform
    // encode && distinct
    // let newData = ''
    // data.forEach( el => {
    //   if (data.hasOwnProperty(el) === true) {
    //     newData = Utils.stringUtils.concat(newData,encodeURIComponent(el), '=', encodeURIComponent(data[el]), )
    //   }
    // })
    return data
  }]
});

/**
 * ajax 异步请求封装方法
 * @param {请求方式} method String
 * @param {路径} url String
 * @param {参数} params Object
 * @param {成功回调函数} successHandler Function
 * @param {失败回调函数} errorHandler Function
 */
var fetch = (method, url, params) => new Promise((resolve, reject) =>{
  let _token = ''
  token && token != ''? _token = token: _token = getStore('authorization')
  http({
    method: method.toUpperCase(),
    url: HOST + url,
    data: method === 'POST' || method === 'PUT' ? JSON.stringify(params) : null,
    // params: method === 'GET' || method === 'DELETE' ? JSON.stringify(params)  : null,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'token': _token,
    }
  }).then(res => {
    // if (res.status === 200) {
    //   resolve(res.data)
    //   // return new Promise(resolve => resolve(res.data))
    // }
    // console.log(res)
    switch(res.status){
      case 200:
        resolve(res.data);
        break
      case 500:
        Toast.fail('服务器响应失败');
        debugger
        this.$router.replace({ name: 'serverResponseFailed'})
        // router.push()
        // this.$message.error('服务器响应失败'+ res.message,);
        // Message.error({
        //   message:
        //   showClose: true
        // })
        break
      case 401:
        // message.error('未登录'+ res.message,);
        // router.push({ name: 'login'})
        break;
      case 404:
      // message.error('服务器找不到该页面'+ res.message);
        // Message.error({
        //   message:
        //   showClose: true
        // })
        break
      case 405:
        // message.error('服务器响应失败'+ res.message);
        break
      default:
     // message.error('服务器响应失败'+ res.message);
    }
  }).catch(e => {
      let res = e.response
    //   let messageData = res.data.message
      switch (res.status) {
        case 500:
          Toast.fail('服务器响应失败')
          debugger
         router.push({ name: 'serverResponseFailed'})
          // router.push({ name: 'serverResponseFailed'})
          break
        case 401:
          Toast.fail('登录失效请先登录')
          router.push({ name: 'bindphone'})

          break
        case 404:
          // message.error('服务器找不到该页面')
          break
        case 403:
          // message.error('没权限访问该页面')
          break
        default:
          // message.error('服务器响应失败, 请重新操作')
      }
      reject(res)
    })
})
/**
/**F
 * 获取令牌初始化方法
 * @param {定时时间} timeout Number
 * @param {获取新令牌} getNewToken Function
 * @param {获取已有令牌} getCacheToken Function
 */
function initToken(timeout, cacheToken, getNewToken){
  if(Object.prototype.toString.call(getNewToken).slice(8, -1) != 'Function'){
    throw new Error('getTokenFunction error')
  }
  token = cacheToken
  this.tokenInterval = setInterval(() => {
    getNewToken()
  }, timeout);
}

export default {
  get:  (url) => new Promise((resolve, reject) => fetch('GET', url,{}).then(res => resolve(res)).catch(err => reject(err))),
  post: (url, params) => new Promise((resolve, reject) => fetch('POST', url, params).then(res => resolve(res)).catch(err => reject(err))),
  put : (url, params) => new Promise((resolve, reject) => fetch('PUT', url, params).then(res => resolve(res)).catch(err => reject(err))),
  delete: (url) => new Promise((resolve, reject) => fetch('DELETE', url, {}).then(res => resolve(res)).catch(err => reject(err))),
  initToken,
};
