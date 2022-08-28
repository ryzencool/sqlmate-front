import React from 'react'
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {getUserInfo, signUpUser} from "../api/dbApi";
import {useNavigate} from "react-router";
import {useAtom} from "jotai";
import {tokenAtomWithPersistence} from "../store/persistStore";
import {userAtom} from "../store/userStore";
import {handleLoginSuccess} from "../utils/auth";

export default function SignUp() {

    const {register, handleSubmit, formState: {errors}} = useForm()


    const [globalToken, setGlobalToken] = useAtom(tokenAtomWithPersistence)
    const [user, setUser] = useAtom(userAtom)

    const navigate = useNavigate()

    const signUpMutation = useMutation(signUpUser, {
        onSuccess: (data) => {
            handleLoginSuccess(data, setGlobalToken, setUser, navigate)
        }
    })

    return <div className={'w-96 '}>
        <div className={'font-bold text-left text-3xl'}>欢迎注册</div>
        <form onSubmit={handleSubmit(data => {
            // console.log(data)
            signUpMutation.mutate(data)
        })}>
            <div className={'flex flex-col gap-4 mt-4'}>

                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>手机号</div>
                    <input
                        {
                            ...register("phone")
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>密码</div>
                    <input type={"password"}
                        {
                            ...register("password")
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>邮箱</div>
                    <input
                        {
                            ...register("email")
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                </div>

                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>验证码</div>
                    <div className={"flex flex-row items-center justify-between gap-2"}>

                        <input
                            {
                                ...register("code")
                            }
                            className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 p-2'}/>
                        <button  className={'h-11 w-1/3 rounded-md bg-indigo-600 text-white text-sm'}>发送验证码</button>

                    </div>

                </div>
                <div className={'mt-2'}>
                    <input type="submit"
                           className={'bg-indigo-600 w-96 h-11 mt-2 tracking-widest text-white rounded-lg'}
                           value={"注册"}/>
                </div>
            </div>

        </form>
        <div className={'w-96 mt-9 rounded-lg border-t bg-slate-300 '}></div>
        <div className={'mt-3 tracking-widest text-center'}>
            已经注册账号，<Link to={"/auth/signIn"}><span className={'text-indigo-600'}>直接登录</span></Link>
        </div>


    </div>
}
