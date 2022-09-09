import React from 'react'
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {getUserInfo, signUpUser} from "../../api/dbApi";
import {useNavigate} from "react-router";
import {useAtom} from "jotai";
import {tokenAtomWithPersistence} from "../../store/jt/tokenLocalStore";
import {userAtom} from "../../store/jt/userStore";
import {handleLoginSuccess} from "../../utils/auth";

export default function SignUp() {

    const {register, handleSubmit, watch,formState: {errors}} = useForm()


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
                    <div className={'block font-semibold text-sm text-gray-700'}>昵称</div>
                    <input
                        {
                            ...register("username", {
                                required: true,
                                minLength: 1
                            })
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                    <div className={'text-red-300 pt-2 pl-2'}>
                    {
                        errors?.username?.type === "required" && "用户名不能为空"
                    }
                    {
                        errors?.username?.type === "minLength" && "用户名长度需要超过1"
                    }
                    </div>
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>手机号</div>
                    <input
                        {
                            ...register("phone", {
                                required: true,
                                pattern: /^1\d{10}$/i
                            })
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                    <div className={'text-red-300 pt-2 pl-2'}>
                        {
                            errors?.phone?.type === "required" && "手机号不能为空"
                        }
                        {
                            errors?.phone?.type === "pattern" && "请输入正确格式的手机号"
                        }
                    </div>
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>密码</div>
                    <input type={"password"}
                        {
                            ...register("password", {
                                required: true,
                                minLength: 8
                            })
                        }
                        className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                    <div className={'text-red-300 pt-2 pl-2'}>
                        {
                            errors?.password?.type === "required" && "密码不能为空"
                        }
                        {
                            errors?.password?.type === "minLength" && "请输入8位及以上的密码"
                        }
                    </div>
                </div>
                <div>
                    <div className={'block font-semibold text-sm text-gray-700'}>确认密码</div>
                    <input type={"password"}
                        {...register("confirmPassword", {
                            required: true,
                            validate: data => {
                                console.log("data校验", data)
                                return data === watch('password')
                            }
                        })}
                           className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 mt-2 p-2'}/>
                    <div className={'text-red-300 pt-2 pl-2'}>
                        {
                            errors?.confirmPassword?.type === "required" && "确认密码不能为空"
                        }
                        {
                            errors?.confirmPassword?.type === "validate" && "请保持和上方输入的密码一致"
                        }
                    </div>
                </div>


                {/*<div>*/}
                {/*    <div className={'block font-semibold text-sm text-gray-700'}>验证码</div>*/}
                {/*    <div className={"flex flex-row items-center justify-between gap-2"}>*/}

                {/*        <input*/}
                {/*            {*/}
                {/*                ...register("code")*/}
                {/*            }*/}
                {/*            className={'border-gray-300 rounded-md border-2 mt-1 block w-96 h-11 p-2'}/>*/}
                {/*        <button type={'button'} className={'h-11 w-1/3 bg-indigo-500 hover:bg-indigo-700 text-white text-sm font-bold  rounded-lg'}>发送验证码</button>*/}

                {/*    </div>*/}

                {/*</div>*/}
                <div className={'mt-2'}>
                    <input type="submit"
                           className={'w-96 h-11 mt-2 tracking-widest bg-indigo-500 hover:bg-indigo-700 text-white  font-bold  rounded-lg'}
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
