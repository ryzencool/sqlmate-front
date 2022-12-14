import React, {useState} from 'react'
import {Button, Card} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import {sql} from "@codemirror/lang-sql";
import {dbAtom} from "../../../store/jt/sqlStore";
import '../../../components/style.css'
import {createColumnHelper,} from '@tanstack/react-table'
import ZTable from "../../../components/table/ZTable";
import {useAtom} from "jotai";
import {consoleSqlAtom} from "../../../store/jt/consoleStore";
import {format} from 'sql-formatter';
import {activeDbTypeAtom} from "../../../store/jt/databaseStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addProjectSql, executeSql, queryOptimizer, syncConsole} from "../../../api/dbApi";
import * as _ from "lodash"
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {useConnectIsLive, useGetConsole} from "../../../store/rq/reactQueryStore";
import toast from "react-hot-toast";
import {EditSqlDialog} from "../sql/DBSql";
import {TemporaryDrawer} from "../../../components/drawer/TemporaryDrawer";
import {OptimizeDrawer} from "./OptimizeDrawer";


export default function DBTerminal() {

    const [db] = useAtom(dbAtom)
    const [consoleSql, setConsoleSql] = useAtom(consoleSqlAtom)
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
                console.log("???????????????", res.data.msg)
                setSqlResult(res.data.msg)
            } else {
                if (res.data.data.length === 0) {
                    setSqlResult("?????????????????????")
                } else {
                    let data = res.data.data
                    console.log("???????????????:", _.keys(data[0]))

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
            toast.error("Sqlite??????????????????");
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
        console.log("?????????", consoleSql)
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
                console.log("????????????", res)
                if (res != null && res.length > 0 && res[0].columns.length > 0) {
                    console.log("??????1?????????", res[0])
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
                    setSqlResult("sql???????????????????????????????????????")
                }
            } catch (e) {
                setSqlResult(e.message)
            }
        } else {
            connectIsLiveQuery.refetch().then(res => {
                if (res.data === false) {
                    toast.error("??????????????????????????????????????????????????????")
                } else {
                    // ???????????????
                    sqlExecuteMutation.mutate({
                        projectId: project.id,
                        sql: executeSql,
                        dbType: databaseType
                    }, {
                        onSuccess: resp => {
                            if (resp.data.code !== "000000") {
                                toa1st.error("??????????????????????????????????????????SQL")
                                return;
                            }
                            setSqlResult("")
                            let res = resp.data.data


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
            toast.error("?????????SQL??????????????????");
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
                toast("????????????console??????")
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
                toast("????????????")
            }
        })
    }

    if (getConsoleQuery.isLoading) {
        return <div>?????????</div>
    }

    return (
        <div className={"w-full grid grid-cols-5 gap-2"}>
            <div className={"flex flex-col gap-1 col-span-5"}>
                <div className={'flex flex-row gap-2'}>
                    <Button size={"small"} variant={"contained"}
                            onClick={() => executeSqlOnline(selectedSql)}>??????</Button>
                    <Button size={"small"} variant={"contained"} onClick={formatSql}>?????????</Button>
                    <Button size={"small"} variant={"contained"} onClick={saveToFavorite}>??????</Button>
                    <EditSqlDialog closeDialog={handleCloseSaveFavorite} mode={1} open={saveFavoriteOpen}
                                   submitForm={submitSaveFavoriteForm} value={{
                        sql: selectedSql
                    }}/>
                    <Button size={"small"} variant={"contained"} onClick={handleExplain}>explain</Button>
                    <Button size={'small'} variant={'contained'} onClick={handleOptimize}>??????</Button>
                    <TemporaryDrawer open={optimizeOpen}
                                     handleClose={() => {
                                         setOptimizeOpen(false)
                                     }}
                                     dir={"right"}
                                     element={<OptimizeDrawer data={optimizeResult}/>}/>
                    <Button size={"small"} variant={"contained"} onClick={saveSql}>??????</Button>
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
                        <div className={"font-bold"}>?????????</div>
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


