import React from 'react'
import {useParams} from "react-router-dom";
import {joinTeam} from "../../../api/dbApi";
import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";


export default function TeamJoin() {

    const {key} = useParams()
    const navigate = useNavigate()

    if (key === null) {
        return <div>当前链接错误，请重新获取团队分享链接</div>
    }


    const joinTeamMutation = useMutation(joinTeam)

    const handleClickJoin = () => {
        joinTeamMutation.mutate({
            key: key
        }, {
            onSuccess: res => {

                navigate(`/header/dashboard/teamDetail/${res.data.data}`)
            }
        })
    }

    const handleClickSignUp = () => {
        navigate("/auth/signUp")
    }


    const auth = localStorage.getItem("authToken");



    return <div className={'w-screen h-screen flex flex-row'}>
        <div className={'w-1/2'}>
            <div className={'pl-10 pt-8 h-1/2 font-bold text-2xl'}>SQLMate</div>
            <div className={' h-1/2 flex flex-col items-center'}>

                <div className={" text-4xl font-bold text-slate-600 font-sans"}> 有朋自远方来，不亦说乎</div>
                {
                    auth ? <div className={'mt-6 underline underline-offset-2  pl-80 font-bold text-neutral-700'}
                                onClick={handleClickJoin}>立即加入</div>
                        : <div onClick={handleClickSignUp} className={'mt-6 underline underline-offset-2  pl-80 font-bold text-neutral-700'}>
                            立即注册
                        </div>
                }
            </div>

        </div>
        <div className={'w-1/2'}>
            <img className={'w-full h-full object-cover'}
                 src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%B0%81%E9%9D%A2/pexels-jess-loiterton-5008377.jpg"}/>
        </div>
    </div>

}
