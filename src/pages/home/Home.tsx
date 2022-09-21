import React from 'react'
import {useNavigate} from 'react-router'
import {Link} from "react-router-dom";
import {Avatar} from "@mui/material";
import {colors} from "../dashboard/project/ProjectCard";
import {useAtom} from "jotai";
import {userAtom} from "../../store/jt/userStore";

export default function Home() {


    let auth = localStorage.getItem("authToken")


    const navigate = useNavigate()

    const [user] = useAtom(userAtom)

    const handleClickStart = () => {
        if (!!auth) {
            navigate('/terminal/dashboard/myProject')
        } else {
            navigate("/auth/signUp")
        }
    }

    return (<div className={'w-screen bg-slate-100 flex-col items-center pb-10'}>
        <div className={' h-20  pl-20 pr-20 flex flex-row justify-between  items-center'}>
            <div className={'flex flex-row gap-7 items-end'}>
                <div className={"font-bold  text-2xl "}>
                    SQLMate
                </div>
                <div>
                    <div className={'text-indigo-400 underline-offset-auto '}>
                        <a href="https://www.wolai.com/x8qUADE2nyif8LXeHgmfk"
                           target="_blank" rel="noreferrer">
                            指南
                        </a>
                    </div>
                </div>
            </div>

            {
                auth ? <div className={" flex flex-row gap-10 items-center text-indigo-700"}>
                        <Link to={"/console/dashboard/myProject"}>
                            <div
                                className={'bg-indigo-400 text-white font-bold rounded-md p-2 w-24 text-center tracking-wider'}>
                                控制台
                            </div>
                        </Link>

                        {/* @ts-expect-error TS(2339) FIXME: Property 'username' does not exist on type '{}'. */}
                        {!!user && !!user.username && <Avatar
                            // @ts-expect-error TS(2339) FIXME: Property 'username' does not exist on type '{}'.
                            className={`text-2xl ${colors[user.username.length % 6]}`}>{user.username?.substring(0, 1)}</Avatar>}
                    </div>
                    :
                    <div className={" flex flex-row gap-6 items-center"}>
                        <div className={"text-indigo-400"} onClick={() => navigate("/auth/signIn")}>登录</div>
                        <div className={"bg-indigo-400 text-white rounded-md pl-2 pr-2 pt-1 pb-1 w-24 text-center"}
                             onClick={() => navigate("/auth/signUp")}>试一试
                        </div>
                    </div>
            }

        </div>

        <div className={"w-screen flex flex-col items-center "}>
            <div className={"font-bold text-5xl tracking-widest mt-28 text-slate-500 "}>SQL界的瑞士军刀</div>
            <div
                className={"tracking-widest  text-indigo-800 mt-16 text-xl  text-center leading-9 w-3/5"}>
                基于SQL创建文档，生成ER图和代码，管理SQL语句，调优SQL，与团队协作，一切尽在SQLMate。
            </div>
            <div className={"mt-16 flex flex-row gap-20"}>
                <div
                    onClick={handleClickStart}
                    className={"bg-white font-bold  rounded-md pl-4 pr-4 pt-3 pb-3 text-lg w-52 text-center transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"}>了解一下
                </div>
                <div
                    className={"bg-indigo-400 font-bold text-white rounded-md pl-4 pr-4 pt-3 pb-3 text-lg w-52 text-center transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"}
                    onClick={handleClickStart}> 开始吧
                </div>
            </div>
        </div>
        <div className={'w-screen flex flex-col items-center mt-20'}>
            <div className={'w-4/5  flex  flex-row justify-center  gap-8 flex-wrap'}>

               
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.50.19.png'}
                             mainTitle={"库表设计"}
                             subTitle={"设计数据库表结构，添加索引，关联逻辑关系"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.52.35.png'}
                             mainTitle={"可视化"}
                             subTitle={"数据库可视化，转化成优美的ER图"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.57.51.png'}
                             mainTitle={"在线测试"}
                             subTitle={"提供测试数据库环境，简单快捷测试"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-05_19.00.48.png'}
                             mainTitle={"模版社区"}
                             subTitle={"共享项目模版，代码生成，难点SQL，学习和借鉴社区项目"}/>

                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-05_17.06.13.png'}
                             mainTitle={"代码生成"}
                             subTitle={"根据模板结合SQL生成各自编程语言代码，轻松编程"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-05_16.58.42.png'}
                             mainTitle={"SQL自动调优"}
                             subTitle={"根据SQL，提供索引推荐，SQL规范检查"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-05_17.03.29.png'}
                             mainTitle={"快照管理"}
                             subTitle={"生成sql快照，轻松管理项目版本，还原版本"}/>
                
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-09_19.35.58.png'}
                             mainTitle={"团队协作"}
                             subTitle={"共享项目SQL，代码，设计，再也不用担心团队管理问题"}/>

            </div>

        </div>

        <div className={'flex flex-col items-center bg-indigo-100 mt-10'}>
            <div className={'font-bold text-3xl tracking-widest mt-6'}>多数据库支持</div>
            <div className={'flex flex-row justify-center gap-16 p-6'}>
                <div className={'w-32 h-24 '}>
                    <img
                        src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/mysql.png"}/>
                </div>
                <div className={'w-32 h-24 '}>
                    <img
                        src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/postgresql.png"}/>
                </div>
                <div className={'w-32 h-24 mt-1'}>
                    <img
                        src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/sqlite.png"}/>
                </div>
                <div className={'w-32 h-24'}>
                    <img
                        src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/sqlserver.png"}/>
                </div>
            </div>
        </div>


        <div className={'mt-10  flex-row flex justify-center'}>
            <div>
                © 2022 SQLMate. All rights reserved.
            </div>
        </div>
    </div>)
}

function FeatureCard({color, img, mainTitle, subTitle}) {
    return (
        <div className={'flex flex-col items-center w-56'}>
            <div className={`${color} rounded-xl w-56 h-32`}>
                <img className={'w-full h-full '}
                     src={`${img}`}/>
            </div>
            <div className={'font-bold mt-2'}>       
                {mainTitle}
            </div>
            <div className={'text-sm text-slate-500 w-4/5'}>
                {subTitle}
            </div>
        </div>
    )
}
