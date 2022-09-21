import {getUserInfo} from "../api/dbApi";
import toast from "react-hot-toast";

export function handleLoginSuccess(data, setGlobalToken, setUser, navigate) {
    if (data.data.code === "000000") {
        setGlobalToken(JSON.stringify({
            token: data.data.data.token
        }))
        getUserInfo({})
            .then(r => {
                console.log("token是", r.data.data)
                setUser(r.data.data)
                navigate("/terminal/dashboard/myProject")
                return r
            })
            .catch(e => {

            })

    } else if (data.data.code === "000003") {
        toast.error("当前手机用户已被注册")
    } else if (data.data.code === "000002") {
        toast.error("用户不存在")
    } else if (data.data.code === "000004") {
        toast.error("密码错误，请重试")
    } else {
        toast.error("注册失败，请联系客服")
    }


}
