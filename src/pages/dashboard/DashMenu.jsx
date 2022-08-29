import React from 'react'
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Grid4x4OutlinedIcon from '@mui/icons-material/Grid4x4Outlined';

export default function DashMenu() {

    const navigate = useNavigate()

    const {pathname} = useLocation()


    return <div className={"flex flex-col items-center  h-[calc(100vh-5rem)]"}>
        <List className={'w-11/12'}>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/header/dashboard/myProject")}
                                className={`rounded-lg ${pathname.includes("myProject") ? "bg-slate-100" : "bg-white"} `}>
                    <ListItemIcon className={'ml-3'}>
                        <ArticleOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="我的项目"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/header/dashboard/favorite")}
                                className={`rounded-lg ${pathname.includes("favorite") ? "bg-slate-100" : "bg-white"}`}>
                    <ListItemIcon className={'ml-3'}>
                        <FavoriteBorderIcon/>
                    </ListItemIcon>
                    <ListItemText primary="我的收藏"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/header/dashboard/publicProject")}
                                className={`rounded-lg ${pathname.includes("publicProject") ? "bg-slate-100" : "bg-white"}`}>
                    <ListItemIcon className={'ml-3'}>
                        <AccountTreeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="公共模版"/>
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/header/dashboard/codeSettings")}
                                className={`rounded-lg ${pathname.includes("codeSettings") ? "bg-slate-100" : "bg-white"}`}>
                    <ListItemIcon className={'ml-3'}>
                        <DataObjectOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="代码模版配置"/>
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>


                <ListItemButton onClick={() => navigate("/header/dashboard/teams")}
                                className={`rounded-lg ${pathname.includes("teams") ? "bg-slate-100" : "bg-white"}`}>
                    <ListItemIcon className={'ml-3'}>
                        <GroupAddOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="我的团队"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/header/dashboard/defaultColumnTemplate")}
                                className={`rounded-lg ${pathname.includes("defaultColumnTemplate") ? "bg-slate-100" : "bg-white"}`}>
                    <ListItemIcon className={'ml-3'}>
                        <Grid4x4OutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="默认字段配置"/>
                </ListItemButton>
            </ListItem>
        </List>
    </div>
}
