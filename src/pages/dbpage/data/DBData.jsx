import React, {useEffect, useState} from 'react'
import {activeTableAtom} from "../../../store/jt/tableListStore";
import {Button, Menu, MenuItem} from "@mui/material";
import {useAtom} from "jotai";
import {useGetTable, useListColumn} from "../../../store/rq/reactQueryStore";
import {createColumnHelper} from "@tanstack/react-table";
import {faker} from "@faker-js/faker";
import * as _ from 'lodash'
import {activeDbTypeAtom} from "../../../store/jt/databaseStore";
import {CodeResult, TemporaryDrawer} from "../../../components/drawer/TemporaryDrawer";
import beautify from 'json-beautify'
import ZTable from "../../../components/table/ZTable";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import {format} from "sql-formatter";
import {cleanTable, executeSql} from "../../../api/dbApi";
import {useMutation} from "@tanstack/react-query";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {dateToDBTime} from "../../../utils/date";
import {IoKeyOutline} from "react-icons/io5";
import {AiOutlineArrowUp} from "react-icons/ai";
import ZBackdrop from "../../../components/feedback/ZBackdrop";
import AlertDialog from "../../../components/dialog/AlertDialog";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

// 展现相关联的表的数据
export default function DBData() {

    const [fakerData, setFakerData] = useState([])
    const [jsonDrawerOpen, setJsonDrawerOpen] = useState(false)
    const [insertDrawerOpen, setInsertDrawerOpen] = useState(false)
    const [activeTableId] = useAtom(activeTableAtom)
    const [activeDbType] = useAtom(activeDbTypeAtom)
    const [project] = useAtom(activeProjectAtom)
    const [insertSql, setInsertSql] = useState("");
    const [insertSqlPreview, setInsertSqlPreview] = useState("");
    const [jsonData, setJsonData] = useState("");
    const [jsonDataPreview, setJsonDataPreview] = useState("");
    const [generateAnchorEl, setGenerateAnchorEl] = useState(null)
    const [exportAnchorEl, setExportAnchorEl] = useState(null)
    const generateDataOpen = Boolean(generateAnchorEl)
    const exportDataOpen = Boolean(exportAnchorEl)
    const [cleanTableOpen, setCleanTableOpen] = useState(false)

    const [bdOpen, setBdOpen] = useState(false)
    const sqlExecuteMutation = useMutation(executeSql)


    const handleBdToggle = () => {
        setBdOpen(!bdOpen)
    }

    const handleCloseBd = () => {
        setBdOpen(false)
    }

    const tableQuery = useGetTable({tableId: activeTableId}, {
        enabled: !!activeTableId,
        refetchOnWindowFocus: false
    })

    const listColumnQuery = useListColumn({tableId: activeTableId}, {
        enabled: !!activeTableId,
        refetchOnWindowFocus: false,
        onSuccess: res => {
            console.log("列表数据", res.data.data)
            let header = res.data.data.map(it => {
                return columnHelper.accessor(it.name, {
                    cell: info => info.getValue(),
                    header: () =>
                        <div className={'flex flex-row gap-2 items-center'}>
                            <span className={'font-bold'}>{it.name}</span>
                            {it.isPrimaryKey && <IoKeyOutline/>}
                            {it.isAutoIncrement && <AiOutlineArrowUp/>}
                        </div>,
                })
            })
            setTableHeader(header)
        }
    })

    const cleanTableMutation = useMutation(cleanTable)


    useEffect(() => {
        setFakerData([])
    }, [activeTableId])

    const [tableHeader, setTableHeader] = useState([])
    const columnHelper = createColumnHelper();


    const handleGenerateData = (generateCount) => {

        handleBdToggle()
        setGenerateAnchorEl(null)

        window.setTimeout(() => {
            let push = []
            let data = listColumnQuery.data.data.data
            data = data.filter(it => !it.isAutoIncrement)
            for (let i = 0; i < generateCount; i++) {
                let res = data.map((it, index) => {
                    let dt;
                    if (it.kindKey != null && it.kindKey !== '' && it.cateKey != null && it.cateKey !== '') {
                        dt = faker[it.kindKey][it.cateKey]()
                        if (dt instanceof Date) {
                            dt = dateToDBTime(dt)
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
                                dt = dateToDBTime(faker.date.recent())
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
            setFakerData(push)

            handleCloseBd()
        }, 0)


    }

    const generateInsert = (mockData) => {

        let tableName = tableQuery.data.data.data.name

        let columns = listColumnQuery.data.data.data

        let fields = columns
            .filter(it => !it.isAutoIncrement)
            .map(it => it.name)
            .join(",")
        let header = `INSERT INTO ${tableName} (${fields}) VALUES `
        console.log("生成：", tableName, fields)
        return header + mockData.map(it => {
            let vs = _.keys(it).map(key => {
                let type = columns.find(f => f.name === key).type;
                type = type.toLowerCase()
                let tempValue = it[key]

                if (!type.includes("int")
                    && !type.includes("float")
                    && !type.includes("double")
                    && !type.includes("decimal")
                    && !type.includes("numeric")) {
                    return `'${tempValue}'`
                } else {
                    return tempValue
                }
            }).join(",")

            return `(${vs})`
        }).join(",")
    }

    const handleClickGenerateSql = () => {
        if (fakerData.length < 10) {
            toast.error("请先生成数据再进行导出操作")
            return;
        }
        console.log(fakerData.slice(0, 9))
        let resPreview = generateInsert(fakerData.slice(0, 9))

        setInsertSqlPreview(format(resPreview))
        let resAll = generateInsert(fakerData);
        setInsertSql(format(resAll));
        setInsertDrawerOpen(true)
    }

    const handleClickGenerateJson = () => {
        if (fakerData.length < 10) {
            toast.error("请先生成数据再进行导出操作")
            return;
        }
        let resPreview = beautify(fakerData.slice(0, 9), null, 2, 100);
        setJsonDataPreview(resPreview);
        let resAll = beautify(fakerData, null, 2, 100)
        setJsonData(resAll)
        setJsonDrawerOpen(true)
    }

    const handleClickSyncDatabase = () => {
        handleBdToggle()
        window.setTimeout(() => {
            let resAll = generateInsert(fakerData);
            if (activeDbType === 0) {
                // 本地sqlite执行
            } else {
                console.log("执行")
                sqlExecuteMutation.mutate({
                    projectId: project.id,
                    dbType: activeDbType,
                    sql: resAll
                }, {
                    onSuccess: res => {
                        handleCloseBd()
                        toast("数据同步完成");

                    }
                })
            }
        }, 0)

    }

    const handleClickClearDatabase = () => {
        handleBdToggle()
        window.setTimeout(() => {
            cleanTableMutation.mutate({
                projectId: project.id,
                tableId: activeTableId,
                dbType: activeDbType
            }, {
                onSuccess: res => {
                    handleCloseBd()

                    toast.success("清空数据库成功")
                }
            })
        }, 0)
        setCleanTableOpen(false)
    }

    const handleClickGenerate = (event) => {
        setGenerateAnchorEl(event.currentTarget);
    };

    const handleClickExport = (event) => {
        setExportAnchorEl(event.currentTarget);

    }

    if (listColumnQuery.isLoading || tableQuery.isLoading) {
        return <div>加载中</div>

    }

    return <div className={"w-full flex flex-col gap-3"}>
        <div className={"w-full flex flex-row gap-3"}>
            <Button size={"small"} variant={"contained"} onClick={handleClickGenerate}>生成单表数据</Button>

            <GenerateDataMenus open={generateDataOpen}
                               handleClose={() => setGenerateAnchorEl(null)}
                               handleGenerateData={handleGenerateData} anchorEl={generateAnchorEl}/>

            <Button size={"small"} variant={"contained"} onClick={handleClickExport}>
                导出
            </Button>
            <ExportMenus anchorEl={exportAnchorEl}
                         open={exportDataOpen}
                         handleClose={() => setExportAnchorEl(null)}
                         handleExportJson={() => handleClickGenerateJson()}
                         handleExportInsert={() => handleClickGenerateSql()}/>
            <TemporaryDrawer open={jsonDrawerOpen}
                             handleClose={() => setJsonDrawerOpen(false)}
                             element={
                                 <Box>
                                     <Button sx={{
                                         marginTop: "10px",
                                         marginLeft: "10px",
                                     }} variant={"contained"} size={"small"}>导出文件</Button>
                                     <CodeResult content={jsonDataPreview} format={'json'}/>
                                 </Box>
                             }/>
            <TemporaryDrawer open={insertDrawerOpen}
                             handleClose={() => setInsertDrawerOpen(false)}
                             element={
                                 <Box>
                                     <Button sx={{
                                         marginTop: "10px",
                                         marginLeft: "10px",
                                     }} variant={"contained"} size={"small"}>导出文件</Button>
                                     <CodeResult content={insertSqlPreview} format={'sql'}/>
                                 </Box>}/>

            <Button size={"small"} variant={"contained"} onClick={handleClickSyncDatabase}>同步到数据库</Button>
            <Button size={"small"} variant={"contained"} onClick={() => {setCleanTableOpen(true)}}>清空数据库</Button>
            <AlertDialog open={cleanTableOpen} handleClose={() => {
                setCleanTableOpen(false)
            }} confirm={() => handleClickClearDatabase()} title={"清空模拟表"} msg={"确定清空当前的模拟表?"}/>
        </div>

        <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-row gap-3 items-end"}>
                    <div className={"text-xl font-bold"}>{activeTableId.name}</div>
                    <div className={"text-base"}>{activeTableId.note}</div>
                </div>
                <div className={'text-sm text-slate-400'}>
                    共<span className={'text-base text-black p-1'}>{fakerData.length}</span>条数据
                </div>
                <ZTable data={fakerData} columns={tableHeader} canSelect={false}/>
            </div>

        </div>

        <ZBackdrop open={bdOpen} handleClose={handleCloseBd}/>
    </div>
}


function ExportMenus({anchorEl, open, handleClose, handleExportJson, handleExportInsert}) {
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
            handleExportJson()
            handleClose()
        }}>JSON</MenuItem>
        <MenuItem onClick={() => {
            handleExportInsert()
            handleClose()

        }}>Insert</MenuItem>

    </Menu>
}


function GenerateDataMenus({anchorEl, open, handleClose, handleGenerateData}) {


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
            handleGenerateData(10)
            handleClose()
        }}>10条</MenuItem>
        <MenuItem onClick={() => {
            handleGenerateData(100)
            handleClose()
        }}>100条</MenuItem>
        <MenuItem onClick={() => {
            handleGenerateData(1000)
            handleClose()

        }}>1000条</MenuItem>
        <MenuItem onClick={() => {
            handleGenerateData(10000)
            handleClose()

        }}>10000条</MenuItem>
        <MenuItem onClick={() => {
            handleGenerateData(100000)
            handleClose()
        }}>100000条</MenuItem>
    </Menu>
}

