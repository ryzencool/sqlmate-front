import React, {useEffect, useState} from 'react'
import {activeTableAtom} from "../../store/tableListStore";
import {Button} from "@mui/material";
import {dbAtom} from "../../store/sqlStore";
import {useAtom} from "jotai";
import {useGetDBML, useListColumn} from "../../store/rq/reactQueryStore";
import {Parser} from "@dbml/core";
import {createColumnHelper} from "@tanstack/react-table";
import {faker} from "@faker-js/faker";
import * as _ from 'lodash'
import {activeDbTypeAtom} from "../../store/databaseStore";
import {CodeResult, TemporaryDrawer} from "../../components/drawer/TemporaryDrawer";
import beautify from 'json-beautify'
import {format} from "sql-formatter";
import ZTable from "../../components/table/ZTable";
import dateFormat from "dateformat";

// 展现相关联的表的数据
export default function DBData() {

    const [db, setDb] = useAtom(dbAtom)
    const [dbmlObj, setDbmlObj] = useState({})
    const [data, setData] = useState([])
    const [jsonDrawerOpen, setJsonDrawerOpen] = useState(false)
    const [insertDrawerOpen, setInsertDrawerOpen] = useState(false)
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [databaseType, setDatabase] = useAtom(activeDbTypeAtom)
    const [insertSql, setInsertSql] = useState("");
    const [jsonData, setJsonData] = useState("");
    const [generateCount, setGenerateCount] = useState(100)
    useGetDBML({tableId: activeTable}, {
        enabled: !!activeTable,
        onSuccess: (data) => {
            let obj = Parser.parse(data.data.data, 'dbml')

            setDbmlObj(obj.schemas[0].tables[0])
            let header = obj.schemas[0].tables[0].fields.map(it => {
                return columnHelper.accessor(it.name, {
                    cell: info => info.getValue(),
                    header: () => <span className={'font-bold'}>{it.name}</span>,

                })
            })
            setTableHeader(header)
        }

    })


    const listColumnQuery = useListColumn({tableId: activeTable}, {
        enabled: !!activeTable
    })


    useEffect(() => {
        setData([])
    }, [activeTable])

    const [tableHeader, setTableHeader] = useState([])
    const columnHelper = createColumnHelper();

    const handleGenerateLinkTableData = () => {
        let push = []
        // 找出和当前表关联的所有表
    }

    const handleGenerateData = () => {
        let push = []
        let data = listColumnQuery.data.data.data
        for (let i = 0; i < generateCount; i++) {
            let res = data.map((it, index) => {
                console.log(it)
                let dt;
                if (it.kindKey != null && it.kindKey !== '' && it.cateKey != null && it.cateKey !== '') {
                    dt = faker[it.kindKey][it.cateKey]()
                    if (dt instanceof Date) {
                        dt = dateFormat(dt, "isoDateTime");
                    }

                } else {
                    let type = it.type.toLowerCase();
                    if (it.isAutoIncrement) {
                        if ((type.includes("int") && it.isAutoIncrement) || type.includes("serial")) {
                            dt = i + 1;
                        }
                    } else {
                        if (type === "tinyint" && !it.isAutoIncrement) {
                            dt = faker.datatype.number(128);
                        } else if ((type === ("smallint") || type.includes("int2")) && !it.isAutoIncrement) {
                            dt = faker.datatype.number(32767);
                        } else if ((type === ("mediumint"))) {
                            dt = faker.datatype.number(8388607);
                        } else if (type === "int" || type === "integer" || type === "int4") {
                            dt = faker.datatype.number(2147483647);
                        } else if (type === "bigint" || type === "int8") {
                            dt = faker.datatype.number(9223372036854775807);
                        }
                        if (type.startsWith("varchar") || type === ("text")) {
                            dt = faker.random.word()
                        }

                        if (type === "timestamp") {
                            dt = dateFormat(faker.date.recent(), "isoDateTime")
                        }
                    }


                }
                return {
                    [it.name]: dt
                }
            }).reduce((a, b) => {
                return {
                    ...a,
                    ...b
                }
            }, {})
            push.push(res)
        }
        setData(push)
    }

    const generateInsert = () => {
        if (dbmlObj.fields == null) {
            return '';
        }
        let tableName = dbmlObj.name
        let fields = dbmlObj.fields.map(it => it.name).join(",")
        let header = `INSERT INTO ${tableName} (${fields}) VALUES `
        console.log("生成：", tableName, fields)
        return header + data.map(it => {
            let vs = _.values(it).join(",")

            return `(${vs})`
        }).join(",")
    }

    const handleClickGenerateSql = () => {
        let res = generateInsert();
        setInsertSql(format(res));
        setInsertDrawerOpen(true)
    }

    const handleClickGenerateJson = () => {
        let res = beautify(data, null, 2, 100)
        setJsonData(res)
        setJsonDrawerOpen(true)
    }

    const handleClickSyncDatabase = () => {
        let res = generateInsert();
        if (databaseType === 1) {
            // 本地sqlite执行
        } else {
            // 请求接口
        }
    }

    const handleClickClearDatabase = () => {

    }

    if (listColumnQuery.isLoading) {
        return <div>加载中</div>
    }

    return <div className={"w-full flex flex-col gap-3"}>
        <div className={"w-full flex flex-row gap-3"}>
            <Button size={"small"} variant={"contained"} onClick={() => {
                handleGenerateData()
            }
            }>生成单表数据</Button>
            {/*<Button size={"small"} variant={"contained"}*/}
            {/*    onClick={() => {handleGenerateLinkTableData()}}*/}
            {/*>生成关联表数据</Button>*/}
            <Button size={"small"} variant={"contained"} onClick={() => setData([])}>清除本地数据</Button>
            <Button size={"small"} variant={"contained"}
                    onClick={handleClickGenerateJson}>导出Json</Button>
            <TemporaryDrawer open={jsonDrawerOpen}
                             handleClose={() => setJsonDrawerOpen(false)}
                             element={<CodeResult content={jsonData} format={'sql'}/>}/>
            <Button size={"small"} variant={"contained"} onClick={handleClickGenerateSql}>导出Insert语句</Button>
            <TemporaryDrawer open={insertDrawerOpen}
                             handleClose={() => setInsertDrawerOpen(false)}
                             element={<CodeResult content={insertSql} format={'sql'}/>}/>

            <Button size={"small"} variant={"contained"} onClick={handleClickSyncDatabase}>同步到数据库</Button>
            <Button size={"small"} variant={"contained"} onClick={handleClickClearDatabase}>清空数据库</Button>


        </div>
        <div>
        </div>

        <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-row gap-3 items-end"}>
                    <div className={"text-xl font-bold"}>{activeTable.name}</div>
                    <div className={"text-base"}>{activeTable.note}</div>
                </div>

                <ZTable data={data} columns={tableHeader} canSelect={false}/>
            </div>

        </div>

    </div>
}




