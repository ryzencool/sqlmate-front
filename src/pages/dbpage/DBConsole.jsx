import React, {useState} from 'react'
import {Button, Card} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import {sql} from "@codemirror/lang-sql";
import {dbAtom} from "../../store/sqlStore";
import '../../components/style.css'
import {createColumnHelper,} from '@tanstack/react-table'
import {activeTableAtom} from "../../store/tableListStore";
import ZTable from "../../components/table/ZTable";
import {useAtom} from "jotai";
import {consoleSqlAtom} from "../../store/consoleStore";
import {format} from 'sql-formatter';
import {activeDbTypeAtom} from "../../store/databaseStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addProjectSql, executeSql, queryOptimizer, syncConsole} from "../../api/dbApi";
import * as _ from "lodash"
import {activeProjectAtom} from "../../store/projectStore";
import {useConnectIsLive, useGetConsole} from "../../store/rq/reactQueryStore";
import toast from "react-hot-toast";
import {EditSqlDialog} from "./DBSql";
import {CodeResult, TemporaryDrawer} from "../../components/drawer/TemporaryDrawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DBConsole() {

    const [db, setDb] = useAtom(dbAtom)
    const [consoleSql, setConsoleSql] = useAtom(consoleSqlAtom)
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [project] = useAtom(activeProjectAtom)
    const [databaseType] = useAtom(activeDbTypeAtom)
    const [selectedSql, setSelectedSql] = useState("")
    const [resultHeader, setResultHeader] = useState([])
    const [saveFavoriteOpen, setSaveFavoriteOpen] = useState(false)
    const [sqlResult, setSqlResult] = useState("")
    const [resultData, setResultData] = useState([]);
    const [optimizeOpen, setOptimizeOpen] = useState(false)
    const [optimizeResult, setOptimizeResult] = useState(null);
    const [sqlResData, setSqlResDate] = useState({
        columns: [],
        values: []
    })

    const queryClient = useQueryClient();

    const optimizeMutation = useMutation(queryOptimizer)
    const connectIsLiveQuery = useConnectIsLive({
        projectId: project.id,
        dbType: databaseType
    }, {
        enabled: !!project.id && databaseType > 0
    })
    const getConsoleQuery = useGetConsole({
        projectId: project.id
    }, {
        enabled: !!project.id,
        refetchOnWindowFocus: false,
        onSuccess: data => {
            setConsoleSql(data.data.data.content)
        }
    })

    const syncConsoleMutation = useMutation(syncConsole, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projectConsole"])
        }
    });

    const saveFavoriteMutation = useMutation(addProjectSql, {
        onSuccess: () => {
            queryClient.invalidateQueries(["projectSqls"])
        }
    })

    const sqlExecuteMutation = useMutation(executeSql, {
        onSuccess: (res) => {
            setSqlResult(null)
            if (res.data.code !== "000000") {
                console.log("接收到错误", res.data.msg)
                setSqlResult(res.data.msg)
            } else {
                if (res.data.data.length === 0) {
                    setSqlResult("当前结果集为空")
                } else {
                    let data = res.data.data
                    console.log("接收到数据:", _.keys(data[0]))

                    setResultHeader(_.keys(data[0]).map(it => {
                        return columnHelper.accessor(it, {
                            header: () => it,
                            cell: info => info.getValue()
                        })
                    }))
                    setResultData(data)
                }
            }
        }
    })


    const columnHelper = createColumnHelper()

    const handleExplain = () => {
        if (selectedSqlIsEmpty(selectedSql)) {
            return;
        }
        setSqlResult("")
        const sql = "explain " + selectedSql
        executeSqlOnline(sql)

    }

    const handleOptimize = () => {
        if (selectedSqlIsEmpty(selectedSql)) {
            return;
        }
        if (databaseType === 0) {
            toast.error("Sqlite暂不支持调优");
        } else {
            optimizeMutation.mutate({
                projectId: project.id,
                sql: selectedSql,
                dbType: databaseType
            }, {
                onSuccess: data => {
                    console.log(data.data.data)
                    setOptimizeResult(data.data.data)
                    setOptimizeOpen(true)

                }
            })
        }
    }

    const formatSql = () => {
        console.log("格式化", consoleSql)
        setConsoleSql(format(consoleSql))
    }

    const executeSqlOnline = (executeSql) => {
        if (selectedSqlIsEmpty(executeSql)) {
            return;
        }
        setSqlResult("")
        if (databaseType === 0) {
            try {
                const res = db.exec(executeSql)
                console.log("结果是：", res)
                if (res != null && res.length > 0 && res[0].columns.length > 0) {
                    console.log("当前1的数据", res[0])
                    setSqlResDate(res[0])
                    setResultHeader(res[0].columns.map(it => {
                        return columnHelper.accessor(it, {
                            header: () => it,
                            cell: info => info.getValue()
                        })
                    }))

                    setResultData(res[0].values.map(it => {
                        return it.reduce((result, field, index) => {
                            result[res[0].columns[index]] = field
                            return result
                        }, {})
                    }))
                } else {
                    setSqlResult("sql检查完成，执行成功，无结果")
                }
            } catch (e) {
                setSqlResult(e.message)
            }
        } else {
            connectIsLiveQuery.refetch().then(res => {
                console.log("判断当前的链接状态", res.data.data.data)
                if (res.data === false) {
                    toast.error("当前与模拟库已断开连接，请先建立连接")
                } else {
                    // 发送给后台
                    sqlExecuteMutation.mutate({
                        projectId: project.id,
                        sql: executeSql,
                        dbType: databaseType
                    }, {
                        onSuccess: data => {
                            setSqlResult("")
                            let res = data.data.data
                            if (!!res && res.length() > 0) {
                                setResultHeader(_.keys(res[0]).map(it => {
                                    return columnHelper.accessor(it, {
                                        header: () => it,
                                        cell: info => info.getValue()
                                    })
                                }))

                                setResultData(res)
                            }

                        }
                    })
                }
            })


        }

    }

    const selectedSqlIsEmpty = (sql) => {
        if (sql == null || sql.trim() === "") {
            toast.error("请选择SQL后进行该操作");
            return true;
        } else {
            return false;
        }
    }

    const saveToFavorite = () => {
        if (selectedSqlIsEmpty(selectedSql)) return;
        setSaveFavoriteOpen(true)
    }

    const saveSql = () => {
        syncConsoleMutation.mutate({
            projectId: project.id,
            content: consoleSql
        }, {
            onSuccess: () => {
                toast("保存当前console成功")
            }
        })
    }

    const handleCloseSaveFavorite = () => {
        setSaveFavoriteOpen(false)
    }

    const submitSaveFavoriteForm = (data, reset) => {
        saveFavoriteMutation.mutate({
            ...data,
            projectId: project.id
        }, {
            onSuccess: () => {
                reset()
                toast("收藏成功")
            }
        })
    }

    if (getConsoleQuery.isLoading) {
        return <div>加载中</div>
    }

    return (
        <div className={"w-full grid grid-cols-5 gap-2"}>
            <div className={"flex flex-col gap-1 col-span-5"}>
                <div className={'flex flex-row gap-2'}>
                    <Button size={"small"} variant={"contained"}
                            onClick={() => executeSqlOnline(selectedSql)}>运行</Button>
                    <Button size={"small"} variant={"contained"} onClick={formatSql}>格式化</Button>
                    <Button size={"small"} variant={"contained"} onClick={saveToFavorite}>收藏</Button>
                    <EditSqlDialog closeDialog={handleCloseSaveFavorite} mode={1} open={saveFavoriteOpen}
                                   submitForm={submitSaveFavoriteForm} value={{
                        sql: selectedSql
                    }}/>
                    <Button size={"small"} variant={"contained"} onClick={handleExplain}>explain</Button>
                    <Button size={'small'} variant={'contained'} onClick={handleOptimize}>调优</Button>
                    <TemporaryDrawer open={optimizeOpen}
                                     handleClose={() => {
                                         setOptimizeOpen(false)
                                     }}
                                     dir={"right"} element={<OptimizeDrawer data={optimizeResult}/>}/>
                    <Button size={"small"} variant={"contained"} onClick={saveSql}>保存</Button>
                </div>
                <div className={'mt-4'}>
                    <CodeMirror
                        height={"300px"}
                        theme={"dark"}
                        value={consoleSql}
                        extensions={[sql()]}
                        onStatistics={data => {
                            setSelectedSql(data.selectionCode)
                        }}
                        onChange={data => {
                            setConsoleSql(data)
                        }}

                    />
                    <div className={"w-full mt-6"}>
                        <div className={"font-bold"}>结果集</div>
                        {!!sqlResult && <Card className={'p-3 mt-3'}>
                            {sqlResult}
                        </Card>}
                        {sqlResult === "" && <div className={'overflow-auto'}>
                            <ZTable data={resultData} columns={resultHeader} canSelect={false}/>
                        </div>}

                    </div>
                </div>
            </div>
        </div>)
}

export  function OptimizeDrawer({data}) {

    if (data === null) {
        return <Box>加载中</Box>
    }

    console.log("穿越", data)


    let indexs = data.indexRecommend.map(it => it.alterIndex).reduce((a, b) => a + b, "");

    let explain = data.explain

    return <Box sx={{
        width: "1000px",
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "30px"
    }}>
        <Box sx={{
            width: "580px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Card sx={{
                width: "100%",
                height: "100px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "50px"
            }}>
                <Box>
                    <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '3rem'
                    }}>{data.score}</Typography>

                </Box>
                <Box>
                    <Box>
                        索引建议: {data.indexRecommend.length}条
                    </Box>
                    <Box>
                        SQL检查: {data.checks.length}条
                    </Box>
                </Box>
            </Card>
            {data.indexRecommend.length > 0 &&
                <Card>
                    <Box sx={{
                        fontWeight: "bold",
                        padding: "10px",
                        borderBottomWidth: "2px",
                        borderBottomColor: "grey",
                    }}>索引建议</Box>

                    <Box>
                        <CodeResult
                            content={indexs}
                            format={"sql"}/>
                    </Box>
                </Card>
            }
            <Card>
                <Box sx={{
                    fontWeight: "bold",
                    padding: "10px",
                    borderBottomWidth: "2px",
                    borderBottomColor: "grey",
                    display: "flex",
                    flexDirection: "row"
                }}>Explain解析</Box>

                <Box sx={{
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'row',

                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "240px",
                        borderRightWidth: "2px",
                        borderRightColor: "grey"
                    }}>
                        {
                            !!explain.explainTable  && explain.explainTable.map(it =>
                                <Box sx={{display: "flex", flexDirection: "row", gap: "10px"}}>
                                    <Box sx={{width: "110px"}}>{it.key}</Box>
                                    <Box sx={{width: "100px"}}>{it.value}</Box>
                                </Box>)
                        }
                    </Box>
                    <Box sx={{paddingLeft: '15px' , display: 'flex', flexDirection: "column", gap: '20px'}}>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                查询类型
                            </Box>
                            <Box>{explain.selectType === null ? '无': explain.selectType.value}</Box>
                        </Box>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                表扫描情况
                            </Box>
                            <Box>{explain.type === null ? '无' : explain.type.value}</Box>
                        </Box>
                        <Box>
                            <Box sx={{fontWeight: "bold"}}>
                                额外信息
                            </Box>
                            <Box>{explain.extra === null ? '无' : explain.extra.value}</Box>
                        </Box>

                    </Box>
                </Box>

            </Card>
        </Box>

        <Box sx={{
            width: "380px",
        }}>
            <Card sx={{
                width: "100%",
            }}>
                <Box sx={{
                    fontWeight: "bold",
                    padding: "15px",
                    borderBottomWidth: "2px",
                    borderBottomColor: "grey"
                }}>SQL检查</Box>

                <Box sx={{
                    padding: '20px',
                    display: "flex",
                    flexDirection: "column",
                    gap: '15px'
                }}>
                    {data.checks.length > 0 && data.checks.map(it =>
                        <Box sx={{
                            // borderBottomWidth: "2px",
                            // borderBottomColor: "grey",
                            paddingBottom: '15px'
                        }}>
                            <Box sx={{
                                fontWeight: "bold"
                            }}>{it.key}</Box>
                            <Box sx={{
                                paddingTop: "5px"
                            }}>{it.value}</Box>
                        </Box>)
                    }
                </Box>


            </Card>
        </Box>
    </Box>
}
