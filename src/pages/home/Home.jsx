import React from 'react'
import {useNavigate} from 'react-router'
import {Link} from "react-router-dom";

export default function Home() {

    const navigate = useNavigate()

    let auth = localStorage.getItem("authToken")


    return <div className={'w-screen bg-slate-100 flex-col items-center'}>
        <div className={' h-16  pl-20 pr-20 flex flex-row justify-between  items-center'}>
            <div className={"font-bold  text-2xl text-center"}>
                SQLMate
            </div>

            {
                auth ? <div className={" flex flex-row gap-6 items-center text-indigo-700"}>
                    <div
                        className={'bg-indigo-400 text-white rounded-md pl-2 pr-2 pt-1 pb-1 w-24 text-center tracking-wider'}>
                        <Link to={"/header/dashboard/myProject"}>控制台</Link></div>
                </div> : <div className={" flex flex-row gap-6 items-center"}>
                    <div className={"text-indigo-400"} onClick={() => navigate("/auth/signIn")}>登录</div>
                    <div className={"bg-indigo-400 text-white rounded-md pl-2 pr-2 pt-1 pb-1 w-24 text-center"}
                         onClick={() => navigate("/auth/signUp")}>试一试
                    </div>
                </div>
            }

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
                    className={"bg-indigo-400 text-white rounded-md pl-4 pr-4 pt-3 pb-3 text-lg w-52 text-center"}>开始吧
                </div>
            </div>
        </div>
        <div className={'w-screen flex flex-col items-center mt-20'}>
            <div className={'w-4/5 flex flex-row justify-center  gap-8 flex-wrap'}>

                <FeatureCard color={'bg-amber-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.50.19.png'}
                             mainTitle={"库表设计"}
                             subTitle={"设计数据库表结构，添加索引，关联逻辑关系"}/>
                <FeatureCard color={'bg-purple-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.52.35.png'}
                             mainTitle={"可视化"}
                             subTitle={"数据库可视化，转化成优美的ER图"}/>
                <FeatureCard color={'bg-emerald-200'}
                             img={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/iShot_2022-09-03_14.57.51.png'}
                             mainTitle={"在线测试"}
                             subTitle={"提供测试数据库环境，简单快捷测试"}/>

                <div className={'flex flex-col items-center w-56'}>
                    <div className={'bg-purple-800 rounded-xl w-56 h-32'}>

                    </div>
                    <div className={'font-bold mt-2'}>
                        模版社区
                    </div>
                    <div className={'text-sm text-slate-500 w-4/5'}>
                        共享项目模版，学习和借鉴社区项目
                    </div>
                </div>
                <div className={'flex flex-col items-center w-56'}>
                    <div className={'bg-purple-800 rounded-xl w-56 h-32'}>

                    </div>
                    <div className={'font-bold mt-2'}>
                        代码生成
                    </div>
                    <div className={'text-sm text-slate-500 w-4/5'}>
                        根据sql生成对应的编程语言代码，轻松写代码
                    </div>
                </div>
                <div className={'flex flex-col items-center w-56'}>
                    <div className={'bg-purple-800 rounded-xl w-56 h-32'}>

                    </div>
                    <div className={'font-bold mt-2'}>
                        SQL智能调优
                    </div>
                    <div className={'text-sm text-slate-500 w-4/5'}>
                        根据SQL，提供索引推荐，SQL规范检查
                    </div>
                </div>
                <div className={'flex flex-col items-center w-56'}>
                    <div className={'bg-purple-800 rounded-xl w-56 h-32'}>

                    </div>
                    <div className={'font-bold mt-2'}>
                        快照管理
                    </div>
                    <div className={'text-sm text-slate-500 w-4/5'}>
                        生成sql快照，轻松管理项目版本
                    </div>
                </div>
                <div className={'flex flex-col items-center w-56'}>
                    <div className={'bg-purple-800 rounded-xl w-56 h-32'}>

                    </div>
                    <div className={'font-bold mt-2'}>
                        团队协作
                    </div>
                    <div className={'text-sm text-slate-500 w-4/5'}>
                        共享项目SQL，代码，设计，再也不用担心团队管理问题
                    </div>
                </div>
            </div>

        </div>

        <div className={'flex flex-col items-center bg-indigo-200 mt-10'}>
            <div className={'font-bold text-3xl tracking-widest mt-4'}>多数据库支持</div>
            <div className={'flex flex-row justify-center gap-16 p-6'}>
                <div className={'w-32 h-24 bg-amber-200 rounded-lg'}>mysql</div>
                <div className={'w-32 h-24 bg-amber-200 rounded-lg'}>postgresql</div>
                <div className={'w-32 h-24 bg-amber-200 rounded-lg'}>sqlite</div>
                <div className={'w-32 h-24 bg-amber-200 rounded-lg'}>sql server</div>
            </div>
        </div>

    </div>
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
