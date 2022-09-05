import React, {useRef, useState} from "react";
import {Outlet, useNavigate} from "react-router";
import Button from "@mui/material/Button";
import OperationMenu from "./dbpage/OperationMenu";
import {useLocation} from "react-router-dom";
import {useGetUserInfo} from "../store/rq/reactQueryStore";
import {Avatar} from "@mui/material";
import {colors} from "./dashboard/project/ProjectCard";

function Header() {




    const location = useLocation()

    const navigate = useNavigate()

    const userQuery = useGetUserInfo({})

    if (userQuery.isLoading) {
        return <div>加载中</div>
    }

    return (
        <div className="h-screen w-screen">
            <div className="h-20  flex-col flex w-full">
                <div className={"h-16  w-screen flex flex-row items-center border-b justify-between w-full"}>
                    <div className={'text-2xl font-bold text-xl pl-10 w-[300px]'} onClick={() => navigate("/index")}>
                        SQLMate
                    </div>
                    <div className={'flex flex-row  items-center justify-between'}>
                        <div>
                            {
                                location.pathname.includes("home") &&  <OperationMenu/>
                            }
                        </div>
                        <div className={"flex flex-row items-center pr-10  gap-5"}>
                            <Button>邀请伙伴</Button>
                            <Button size={"small"} variant={"contained"} onClick={() => navigate('/header/dashboard/myProject')}>控制台</Button>
                            <div>
                                <Avatar className={`text-2xl ${colors[userQuery.data.data.data.username.length % 6]}`}>{userQuery.data.data.data.username.substring(0, 1)}</Avatar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"h-[calc(100vh-5rem)]"}>
                <Outlet/>
            </div>
        </div>
    );
}

export default Header;
