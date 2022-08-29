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
import {databaseTypeAtom} from "../../store/databaseStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {executeSql} from "../../api/dbApi";
import * as _ from "lodash"
import {activeProjectAtom} from "../../store/projectStore";

export default function DBConsole() {

    const [db, setDb] = useAtom(dbAtom)
    const [consoleSql, setConsoleSql] = useAtom(consoleSqlAtom)
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [project, setProject] = useAtom(activeProjectAtom)
    const [databaseType, setDatabaseType] = useAtom(databaseTypeAtom)
    const [selectedSql, setSelectedSql] = useState("")
    const [resultHeader, setResultHeader] = useState([])

    const [sqlResult, setSqlResult] = useState("")
    const [resultData, setResultData] = useState([]);
    const [sqlResData, setSqlResDate] = useState({
        columns: [],
        values: []
    })


    const queryClient = useQueryClient();

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
                    setResultHeader(_.keys(data[0]).map(it => {
                        return columnHelper.accessor(it, {
                            header: () => it,
                            cell: info => info.getValue()
                        })
                    }))
                    setResultData(data)
                }
                console.log("接收到数据:", res.data.data)
            }
        }
    })


    const columnHelper = createColumnHelper()

    const handleExplain = () => {
        setSqlResult("")
        const sql = "explain " + selectedSql
        if (databaseType === 0) {
            db.exec(sql)
        } else {
            sqlExecuteMutation.mutate({
                sql: sql
            })
        }
    }

    const formatSql = () => {
        console.log("格式化", consoleSql)
        setConsoleSql(format(consoleSql))
    }

    const executeSqlOnline = () => {
        setSqlResult("")
        if (databaseType === 0) {
            try {
                const res = db.exec(selectedSql)
                console.log(res)
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
            // 发送给后台
            sqlExecuteMutation.mutate({
                sql: selectedSql
            })
        }

    }
    return (
        <div className={"w-full grid grid-cols-5 gap-2"}>
            <div className={"flex flex-col gap-1 col-span-5"}>
                <div className={'flex flex-row gap-2'}>
                    <Button size={"small"} variant={"contained"} onClick={() => executeSqlOnline()}>运行</Button>
                    <Button size={"small"} variant={"contained"} onClick={() => formatSql()}>格式化</Button>
                    <Button size={"small"} variant={"contained"}>复制</Button>
                    <Button size={"small"} variant={"contained"}>收藏</Button>
                    <Button size={"small"} variant={"contained"} onClick={() => {
                        handleExplain()
                    }}>explain</Button>
                </div>
                <div className={'mt-4'}>
                    <CodeMirror
                        height={"300px"}
                        theme={"dark"}
                        value={consoleSql}
                        extensions={[sql()]}
                        onStatistics={data => {
                            console.log(data.selectionCode)
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
                        { sqlResult === "" && <div className={'overflow-auto'}>
                            <ZTable data={resultData} columns={resultHeader} canSelect={false}/>
                        </div>}

                    </div>
                </div>
            </div>
        </div>)
}
