import React from 'react'
import DashMenu from "./DashMenu";
import {Outlet} from 'react-router'
import {Breadcrumbs, Link} from "@mui/material";
import {useLocation} from "react-router-dom";

export default function Dashboard() {

    const {pathname} = useLocation()

    console.log("当前的路径名称是", pathname)

    const menuItems = pathname.split("/").slice(2, 4);

    console.log(menuItems)
    return (<div className="grid grid-cols-[280px_1fr] h-full ">
        <div>
            <DashMenu/>
        </div>
        <div className={'mt-4 ml-2'}>
            <div className={'pl-2'}>
                <Breadcrumbs aria-label="breadcrumb">

                    {
                        menuItems.map((item, index) => (
                            <Link key={index} underline="hover" color="inherit">
                                {
                                    item === "dashboard" && "控制台"
                                }
                                {
                                    item === "favorite" && "我的收藏"
                                }
                                {
                                    item === "myProject" && "我的项目"
                                }
                                {
                                    item === "publicProject" && "公共项目"
                                }
                                {
                                    item === "codeSettings" && "代码模版配置"
                                }
                                {
                                    item === "teams" && "我的团队"
                                }
                                {
                                    item === "defaultColumnTemplate" && "默认字段配置"
                                }
                            </Link>
                        ))
                    }
                    
                </Breadcrumbs>
            </div>
            <div className={'mt-6 overflow-auto h-[calc(100vh-9.5rem)]  pl-2'}>
                <Outlet/>
            </div>
        </div>
    </div>)
}
