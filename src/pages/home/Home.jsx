import React from 'react'
import {useNavigate} from 'react-router'
import {Link} from "react-router-dom";

export default function Home() {

    const navigate = useNavigate()

    return <div className={'w-screen h-screen bg-indigo-50'}>
        <div className={'w-screen h-16  grid grid-cols-6 items-center'}>
            <div className={"col-span-1 font-bold  text-2xl text-center"}>
                SQLMate
            </div>
            <div className={"col-span-4 flex flex-row gap-6 items-center text-indigo-700"}>
                <div>特性</div>
                <div>
                    <Link to={"/header/home"}>项目</Link>
                </div>
                <div><Link to={"/header/dashboard/myProject"}>控制台</Link></div>
                <div>模版</div>
                <div>更新</div>
            </div>
            <div className={"col-span-1 flex flex-row gap-6 items-center"}>
                <div className={"text-indigo-700"} onClick={() => navigate("/auth/signIn")}>登录</div>
                <div className={"bg-indigo-800 text-white rounded-md pl-2 pr-2 pt-1 pb-1 w-24 text-center"}>试一试</div>
            </div>
        </div>

        <div className={"w-screen flex flex-col items-center "}>
            <div className={"font-bold text-5xl tracking-widest mt-28"}>SQL界的瑞士军刀</div>
            <div
                className={"tracking-widest  text-indigo-800 mt-16 text-xl  text-center leading-9 w-3/5"}>
                基于SQL创建文档，生成ER图和代码，管理SQL语句，调优SQL，与团队协作，一切尽在SQLMate。
            </div>
            <div className={"mt-16 flex flex-row gap-20"}>
                <div className={"bg-white  rounded-md pl-4 pr-4 pt-3 pb-3 text-lg w-52 text-center"}>了解一下</div>
                <div
                    className={"bg-indigo-800 text-white rounded-md pl-4 pr-4 pt-3 pb-3 text-lg w-52 text-center"}>开始吧
                </div>
            </div>
        </div>
    </div>
}
