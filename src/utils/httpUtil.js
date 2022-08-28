import axios from 'axios'
import {host} from "../SystemConfig";
import toast from "react-hot-toast";
import {currentTime} from "./dateUtil";

const onSuccess = resp => {
    // filter some business exception
    return resp
}

const onError = error => {
    // optional catch errors and add additional logging hear
    return error
}


export  function  get(url, params = {}) {

    let value = "";
    let ps = Object.entries(params).map(it => {
        return it[0] + "=" + it[1]
    });
    if (ps.length > 0) {
        value = "?" + ps.join("&")
    }
    let auth = localStorage.getItem("authToken")
    let headers = {}
    if (!!auth) {
        let obj = JSON.parse(auth)
        let time = currentTime()
        // if (auth.expiredTime / 1000 < time ) {
        //     toast("当前登录凭证已到期，请重新登录", {
        //         position: 'top',
        //         duration: 5000
        //     })
        //     return;
        // }
        headers = {"Authorization": "bearer " + obj.token};
    }

    return axios({
        method: 'get',
        url: `${host}${url}${value}`,
        headers: headers

    }).then(onSuccess).catch(onError)
}


export function post(url, params = {}, header = {}) {
    let auth = localStorage.getItem("authToken")
    let headers = {}
    if (!!auth) {
        let obj = JSON.parse(auth)
        let time = currentTime()
        // if (auth.expiredTime / 1000 < time ) {
        //     toast("当前登录凭证已到期，请重新登录", {
        //         position: 'top',
        //         duration: 5000
        //     })
        //     return;
        // }
        headers = {"Authorization": "bearer " + obj.token};
    }

    return axios({
        method: 'post',
        url: `${host}${url}`,
        headers: headers,
        data: params
    }).then(onSuccess).catch(onError)
}
