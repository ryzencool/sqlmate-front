import React, {useState} from "react";
import {Outlet, useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useLocation} from "react-router-dom";
import {
    useConnectIsLive,
    useGetProject,
    useGetUserInfo,
    useListTablesDetail,
    useProjectDBML
} from "../store/rq/reactQueryStore";
import {Avatar} from "@mui/material";
import {colors} from "./dashboard/project/ProjectCard";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import Select from 'react-select';
import OperationMenu from "./dbpage/OperationMenu";
import SyncIcon from '@mui/icons-material/Sync';
import toast from "react-hot-toast";
import {exporter} from "@dbml/core";
import {activeDbTypeAtom} from "../store/databaseStore";
import {dbAtom} from "../store/sqlStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createConnect, syncDatabase, updateProject} from "../api/dbApi";
import AlertDialog from "../components/dialog/AlertDialog";
import LinkIcon from '@mui/icons-material/Link';
import {LinkOff} from "@mui/icons-material";
import {SiMysql, SiPostgresql, SiSqlite} from "react-icons/si";


const dbTypeSelectOptions = [{
    value: 0,
    label:
        <div className={'flex flex-row gap-1 items-center text-sm'}><SiSqlite/>
            <div>Sqlite</div>
        </div>
}, {
    value: 1,
    label:
        <div className={'flex flex-row gap-1 items-center  text-sm'}><SiMysql/>
            <div>Mysql</div>
        </div>
}, {
    value: 2,
    label:
        <div className={'flex flex-row gap-1 items-center  text-sm'}><SiPostgresql/>
            <div>PG</div>
        </div>
}];


function Header() {
    const [sqliteDB] = useAtom(dbAtom)


    const [project] = useAtom(activeProjectAtom)
    const [dbType] = useAtom(activeDbTypeAtom)

    const [syncDbAlert, setSyncDbAlert] = useState(false)

    const location = useLocation()

    const navigate = useNavigate()

    const [activeDbType, setActiveDbType] = useAtom(activeDbTypeAtom);

    const queryClient = useQueryClient()
    const dbmlProjectQuery = useProjectDBML({projectId: project.id}, {
        enabled: false
    })

    const userQuery = useGetUserInfo({})



    const connectIsLiveQuery = useConnectIsLive({
        projectId: project.id, dbType: activeDbType
    }, {
        enabled: !!project.id && activeDbType > 0
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

    const createConnectMutation = useMutation(createConnect, {
        onSuccess: res => {
            console.log("链接数据库结果", res.data);
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
        if (activeDbType === 0) {
            execSqlite()
            toast("同步Sqlite成功")
        } else {
            console.log("当前类型")
            // 生成dbml 然后生成sql 进行插入
            dbmlProjectQuery.refetch().then(res => {
                let sql;
                if (activeDbType === 1) {
                    sql = 'mysql'
                } else if (activeDbType === 2) {
                    sql = 'postgres'
                } else if (activeDbType === 3) {
                    sql = 'mssql'
                }


                let lang = exporter.export(res.data.data.data, sql);

                if (lang.includes("(now())")) {
                    lang = lang.replaceAll("(now())", "now()")
                }

                console.log("cula")

                // 插入
                syncDatabaseMutation.mutate({
                    projectId: project.id, sql: lang, dbType: activeDbType
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
        setSyncDbAlert(false)
    }

    const handleDbChange = (evt) => {
        console.log("选中db", evt.value)
        let dbType = evt.value
        console.log(dbType)
        projectMutation.mutate({
            id: project.id, dbType: dbType
        }, {
            onSuccess: data => {
                setActiveDbType(dbType)
            }
        })
    }

    const handleCreateConnect = () => {
        createConnectMutation.mutate({
            projectId: project.id, dbType: activeDbType
        }, {
            onSuccess: res => {
                toast("连接远程模拟库成功")
            }
        })
    }

    if (userQuery.isLoading) {
        return <div>加载中</div>
    }


    // console.log("链接状态是", connectIsLiveQuery.data.data.data)


    return (<div className="h-screen w-screen">
        <div className="h-20  flex-col flex w-full">
            <div className={"h-16 grid grid-cols-[350px_1fr]  w-screen  border-b w-full"}>
                <div className={'flex  flex-row gap-2 items-center justify-between'}>
                    <div className={'text-2xl font-bold text-xl pl-5'} onClick={() => navigate("/index")}>
                        SQLMate
                    </div>
                    {location.pathname.includes("home")
                        && <div className={'pr-6 flex flex-row items-center gap-2'}>
                            <Select className={'text-sm'}
                                    defaultValue={ activeDbType ? dbTypeSelectOptions.find(it => it.value === activeDbType) : dbTypeSelectOptions[0]}
                                    onChange={handleDbChange}
                                    options={dbTypeSelectOptions}
                            />


                            {activeDbType > 0 ? <div>
                                {!connectIsLiveQuery.isLoading && connectIsLiveQuery.data.data.data ? <LinkIcon
                                    className={'text-2xl transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}
                                    onClick={handleCreateConnect}/> : <LinkOff
                                    className={'text-2xl text-gray-400 transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}/>
                                }


                            </div> : <div title={"模拟库连接状态"}>
                                <LinkIcon
                                    className={'text-2xl  text-blue-500 '}

                                />
                            </div>}
                            <div title={"同步数据库"}>
                                <SyncIcon
                                    className={'text-3xl transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}
                                    onClick={() => setSyncDbAlert(true)}/>
                            </div>

                            <AlertDialog title={"和远端数据库同步"} open={syncDbAlert}
                                         handleClose={() => setSyncDbAlert(false)} confirm={handleSyncDatabase}
                                         msg={"同步过程中将重建模拟库中的所有表结构，并删除数据"}/>
                        </div>}


                </div>

                <div className={'flex flex-row justify-between items-center'}>
                    <div>
                        <div>
                            {location.pathname.includes("home") && <OperationMenu/>}
                        </div>
                    </div>
                    {location.pathname.includes("home") && <div className={'font-bold text-xl'}>
                        {project?.name?.toUpperCase()}
                    </div>}

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
    </div>);
}

export default Header;
