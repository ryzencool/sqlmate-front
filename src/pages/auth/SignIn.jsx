import React from 'react'
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {getUserInfo, signInUser} from "../../api/dbApi";
import {useAtom} from "jotai";
import {userAtom} from "../../store/userStore";
import {tokenAtomWithPersistence} from "../../store/tokenLocalStore";
import {handleLoginSuccess} from "../../utils/auth";
import {useNavigate} from "react-router";

export default function SignIn() {

    const {register, handleSubmit, formState: {errors}} = useForm()
    const [user, setUser] = useAtom(userAtom)
    const [globalToken, setGlobalToken] = useAtom(tokenAtomWithPersistence)
    const navigate = useNavigate()
    const postSignIn = useMutation(signInUser, {
        onSuccess: (data) => {
            handleLoginSuccess(data, setGlobalToken, setUser, navigate)
        }
    })

    return <div className={'w-96 '}>
        <div className={'font-bold text-left text-3xl'}>欢迎回来</div>
        <div className={'space-y-4 mt-6'}>
            <form onSubmit={
                handleSubmit(data => {
                    postSignIn.mutate(data)
                })
            }>
                <div className={'flex flex-col gap-4'}>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>手机号</div>
                    <input
                        {...register("phone", {
                            required: true,
                            maxLength: 13,
                            minLength: 10
                        })}
                        className={'border-gray-300 rounded-md border-2 mt-2 block w-96 h-11 p-2'} />
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>密码</div>
                    <input type={"password"}
                        {...register("password", {
                            required : true,
                            minLength: 8,
                        })}
                        className={'border-gray-300 rounded-md border-2 mt-2 block w-96 h-11 p-2'}/>
                </div>

                <div>
                    <input type={"submit"} className={' w-96 h-11 mt-2 tracking-widest bg-indigo-500 hover:bg-indigo-700 text-white  font-bold  rounded-lg'} value={"登录"}/>
                </div>
                </div>
            </form>
        </div>
        <div className={'w-96 mt-9 rounded-lg border-t bg-slate-300 '}></div>
        <div className={'mt-3 tracking-widest text-center'}>
            还未注册，<Link to={"/auth/signUp"}><span className={'text-indigo-500'}>快速注册</span></Link>
        </div>
    </div>
}
