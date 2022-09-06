import React, {useState} from "react";
import {Outlet, useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useLocation} from "react-router-dom";
import {useGetUserInfo, useListTablesDetail, useProjectDBML} from "../store/rq/reactQueryStore";
import {Avatar} from "@mui/material";
import {colors} from "./dashboard/project/ProjectCard";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import Select from 'react-select';
import OperationMenu from "./dbpage/OperationMenu";
import SyncIcon from '@mui/icons-material/Sync';
import toast from "react-hot-toast";
import {exporter} from "@dbml/core";
import {databaseTypeAtom} from "../store/databaseStore";
import {dbAtom} from "../store/sqlStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {syncDatabase, updateProject} from "../api/dbApi";

function Header() {
    const [sqliteDB] = useAtom(dbAtom)

    const options = [
        {value: 0, label: 'Sqlite'},
        {value: 1, label: 'Mysql'},
        {value: 2, label: 'Postgres'},
        {value: 3, label: 'SqlServer'},
    ];
    const [project] = useAtom(activeProjectAtom)

    const [selectedOption, setSelectedOption] = useState()

    const location = useLocation()

    const navigate = useNavigate()

    const userQuery = useGetUserInfo({})
    const [activeDatabase, setActiveDatabase] = useAtom(databaseTypeAtom);

    const [actTable, setActTable] = useAtom(activeProjectAtom)

    const queryClient = useQueryClient()
    const dbmlProjectQuery = useProjectDBML({projectId: project.id}, {
        enabled: false
    })
    const allTableQuery = useListTablesDetail({projectId: project.id}, {
        enabled: false
    })
    const syncDatabaseMutation = useMutation(syncDatabase)
    const projectMutation = useMutation(updateProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['project'])
        }

    })

    const generateSqliteCol = (col) => {
        let name = col.name
        let type = col.type
        if (type.includes("int")) {
            type = "integer"
        }
        let isUnique = col.isUniqueKey
        let isPrimary = col.isPrimaryKey
        let isAutoIncrement = col.isAutoIncrement
        let isNotNull = col.isNotNull
        let header = `\t${name} ${type}`
        if (isUnique) header += ` unique`
        if (isPrimary) header += ` primary key`
        if (isAutoIncrement) header += ` autoincrement`
        if (isNotNull) header += ` not null`
        return header;
    }


    const execSqlite = () => {
        allTableQuery.refetch().then(data => {
            let tableInfo = data.data.data.data
            tableInfo.forEach(table => {
                sqliteDB.exec(`drop table if exists ${table.title}`)
                let cols = table.content.map(col => {
                    return generateSqliteCol(col)
                }).join(",\n")
                let tableText = `create table if not exists ${table.title} (
${cols} 
)`
                console.log(tableText)
                sqliteDB.exec(tableText)
            })
        })
    }


    const handleSyncDatabase = () => {
        // 获取所有的表
        if (activeDatabase === 0) {
            execSqlite()
            toast("同步Sqlite成功")
        } else {
            console.log("当前类型")
            // 生成dbml 然后生成sql 进行插入
            dbmlProjectQuery.refetch().then(res => {
                let sql;
                if (activeDatabase === 1) {
                    sql = 'mysql'
                } else if (activeDatabase === 2) {
                    sql = 'postgres'
                } else if (activeDatabase === 3) {
                    sql = 'mssql'
                }


                let lang = exporter.export(res.data.data.data, sql);

                if (lang.includes("(now())")) {
                    lang = lang.replaceAll("(now())", "now()")
                }

                console.log("cula")

                // 插入
                syncDatabaseMutation.mutate({
                    projectId: project.id,
                    sql: lang,
                    dbType: activeDatabase
                }, {
                    onSuccess: (res) => {
                        console.log("返回的结果是", res.data)
                        if (res.data.code !== "000000") {
                            toast.error(`同步${sql}模拟库失败`)
                        } else {
                            toast(`同步${sql}成功`)
                        }

                    }
                })

            })
        }
    }

    const handleDbChange = (evt)=> {
        console.log("选中db", evt.value)
        let dbType = evt.value
        console.log(dbType)
        projectMutation.mutate({
            id: project.id,
            dbType: dbType
        }, {
            onSuccess: data => {
                setActiveDatabase(dbType)
            }
        })
    }


    if (userQuery.isLoading) {
        return <div>加载中</div>
    }


    return (
        <div className="h-screen w-screen">
            <div className="h-20  flex-col flex w-full">
                <div className={"h-16 grid grid-cols-[320px_1fr]  w-screen  border-b w-full"}>
                    <div className={'flex  flex-row gap-2 items-center justify-between'}>
                        <div className={'text-2xl font-bold text-xl pl-5'} onClick={() => navigate("/index")}>
                            SQLMate
                        </div>
                        {location.pathname.includes("home") &&
                            <div className={'pr-6 flex flex-row items-center gap-2'}>
                                <Select className={'text-sm'}
                                        defaultValue={project.dbType ? options.find(it => it.value === project.dbType) : options[0]}
                                        onChange={handleDbChange}
                                        options={options}
                                />
                                <SyncIcon
                                    className={' text-3xl transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}
                                    onClick={() => handleSyncDatabase()}/>
                            </div>
                        }


                    </div>

                    <div className={'flex flex-row justify-between items-center'}>
                        <div>
                            <div>
                                {
                                    location.pathname.includes("home") && <OperationMenu/>
                                }
                            </div>
                        </div>
                        {
                            location.pathname.includes("home") &&
                            <div className={'font-bold text-xl'}>
                                {
                                    project?.name?.toUpperCase()
                                }
                            </div>
                        }

                        <div className={'flex flex-row  items-center justify-between'}>

                            <div className={"flex flex-row items-center pr-10  gap-5"}>
                                {/*<Button>邀请伙伴</Button>*/}
                                <Button size={"small"} variant={"contained"}
                                        onClick={() => navigate('/header/dashboard/myProject')}>控制台</Button>
                                <div>
                                    <Avatar
                                        className={`text-2xl ${colors[userQuery.data.data.data.username.length % 6]}`}>{userQuery.data.data.data.username.substring(0, 1)}</Avatar>
                                </div>
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
