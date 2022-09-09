import React, {useState} from "react";
import {Outlet, useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useLocation, useParams} from "react-router-dom";
import {
    useConnectIsLive,
    useGetProject,
    useGetUserInfo,
    useListTables,
    useListTablesDetail,
    useProjectDBML
} from "../store/rq/reactQueryStore";
import {Avatar, Menu, MenuItem} from "@mui/material";
import {colors} from "./dashboard/project/ProjectCard";
import {useAtom} from "jotai";
import Select from 'react-select';
import ActionMenu from "./dbpage/ActionMenu";
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

    const {id: projectId} = useParams()

    const [sqliteDB] = useAtom(dbAtom)

    const [activeDbType, setActiveDbType] = useAtom(activeDbTypeAtom)
    const [selectDbType, setSelectDbType] = useState(dbTypeSelectOptions[0])
    const [syncDbAlert, setSyncDbAlert] = useState(false)

    const location = useLocation()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const [profileAnchorEl, setProfileAnchorEl] = useState()
    const profileOpen = Boolean(profileAnchorEl)

    const dbmlProjectQuery = useProjectDBML({projectId: projectId}, {
        enabled: false
    })

    const userQuery = useGetUserInfo({})

    const {data: tablesData, isLoading: isLoadingTables} = useListTables({projectId: projectId}, {
        enabled: !!projectId
    })


    const {data: project} = useGetProject({id: projectId}, {
        enabled: !!projectId,
        onSuccess: res => {
            let type = res.data.data.dbType
            const selectedType = dbTypeSelectOptions.find(it => it.value === type)
            setSelectDbType(selectedType)
            setActiveDbType(type)
        }
    })

    const dbType = project?.data?.data?.dbType

    const connectIsLiveQuery = useConnectIsLive({
        projectId: projectId,
        dbType: dbType
    }, {
        enabled: !!projectId && !!dbType && dbType > 0
    })

    const allTableQuery = useListTablesDetail({projectId: projectId}, {
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
            queryClient.invalidateQueries(['connectIsLive'])
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
        console.log("侍弄那对哦分分")

        if (isLoadingTables) {
            toast("加载中")
            return;
        }

        let tables = tablesData?.data?.data

        console.log("表格是", tables)

        if (tables === null || tables.length === 0) {
            toast("请至少创建一个数据表，再进行当前操作");
            return;
        }


        // 获取所有的表
        if (activeDbType === 0) {
            execSqlite()
            toast("同步Sqlite成功")
        } else {
            console.log("当前类型")
            // 生成dbml 然后生成sql 进行插入
            dbmlProjectQuery.refetch().then(res => {
                let sql;
                if (dbType === 1) {
                    sql = 'mysql'
                } else if (dbType === 2) {
                    sql = 'postgres'
                } else if (dbType === 3) {
                    sql = 'mssql'
                }


                let lang = exporter.export(res.data.data.data, sql);

                if (lang.includes("(now())")) {
                    lang = lang.replaceAll("(now())", "now()")
                }

                // 插入
                syncDatabaseMutation.mutate({
                    projectId: projectId, sql: lang, dbType: activeDbType
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
        projectMutation.mutate({
            id: projectId, dbType: dbType
        })
    }

    const handleSignOut = () => {
        localStorage.removeItem("authToken")
        navigate("/")
    }

    const handleCreateConnect = () => {
        console.log("建立连接", projectId, dbType)
        createConnectMutation.mutate({
            projectId: projectId,
            dbType: dbType
        }, {
            onSuccess: res => {
                toast("连接远程模拟库成功")
            }
        })
    }

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);

    }

    if (userQuery.isLoading) {
        return <div>加载中</div>
    }

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
                                    defaultValue={selectDbType}
                                    value={selectDbType}
                                    onChange={handleDbChange}
                                    options={dbTypeSelectOptions}
                            />

                            {selectDbType > 0 ?
                                <div>
                                    {!connectIsLiveQuery.isLoading && connectIsLiveQuery.data.data.data ?
                                        <LinkIcon
                                            className={'text-2xl transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}
                                        />
                                        :
                                        <LinkOff onClick={handleCreateConnect}
                                                 className={'text-2xl text-gray-400 transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}/>
                                    }
                                </div>
                                :
                                <div title={"模拟库连接状态"}>
                                    <LinkIcon
                                        className={'text-2xl  text-blue-500 '}
                                    />
                                </div>}
                            <div title={"同步远程模拟库"}>
                                <SyncIcon
                                    className={'text-3xl transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300'}
                                    onClick={() => setSyncDbAlert(true)}/>
                            </div>

                            <AlertDialog title={"和远端数据库同步"} open={syncDbAlert}
                                         handleClose={() => setSyncDbAlert(false)}
                                         confirm={handleSyncDatabase}
                                         msg={"同步过程中将重建模拟库中的所有表结构，并删除数据"}/>
                        </div>}


                </div>

                <div className={'flex flex-row justify-between items-center'}>
                    <div>
                        <div>
                            {location.pathname.includes("home") && <ActionMenu/>}
                        </div>
                    </div>
                    {location.pathname.includes("home") && <div className={'font-bold text-xl'}>
                        {project?.data?.data?.name?.toUpperCase()}
                    </div>}

                    <div className={'flex flex-row  items-center justify-between'}>

                        <div className={"flex flex-row items-center pr-10  gap-5"}>
                            <Button size={"small"} variant={"contained"}
                                    onClick={() => navigate('/header/dashboard/myProject')}>控制台</Button>
                            <div>
                                <Avatar onClick={handleProfileClick}
                                        className={`text-2xl ${colors[userQuery.data.data.data.username.length % 6]}`}>{userQuery.data.data.data.username.substring(0, 1)}</Avatar>

                                <ProfileMenus open={profileOpen} anchorEl={profileAnchorEl} handleClose={() => {
                                    setProfileAnchorEl(null)
                                }} handleSignOut={handleSignOut}/>


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


function ProfileMenus({anchorEl, open, handleClose, handleSignOut}) {
    return <Menu
        size={'small'}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}
    >
        <MenuItem onClick={() => {
            handleSignOut()
            handleClose()
        }}>退出</MenuItem>

    </Menu>
}
