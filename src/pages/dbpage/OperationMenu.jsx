import Button from "@mui/material/Button";
import React, {useRef} from 'react'
import {Menu, MenuItem} from "@mui/material";
import {exporter, importer} from "@dbml/core";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/projectStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {importProjectDbml, syncDatabase} from "../../api/dbApi";
import {databaseTypeAtom} from "../../store/databaseStore";
import {useListTablesDetail, useProjectDBML} from "../../store/rq/reactQueryStore";
import {dbAtom} from "../../store/sqlStore";
import toast from "react-hot-toast";

export default function OperationMenu() {

    const [project] = useAtom(activeProjectAtom)
    const [sqliteDB] = useAtom(dbAtom)
    const [activeDatabase] = useAtom(databaseTypeAtom);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const fileInput = useRef()
    const showFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            console.log(text.toString())
            let dbType;
            if (activeDatabase === 1) {
                dbType = 'mysql'
            } else if (activeDatabase === 2){
                dbType = 'postgres'
            } else if (activeDatabase === 3) {
                dbType ='mssql'
            }

            let dbml = importer.import(text.toString(), dbType)
            console.log(dbml)
            let sqlJson = exporter.export(dbml, 'json');
            console.log(sqlJson)
            importDbmlMutation.mutate({
                projectId: project.id,
                dbmlJson: sqlJson
            })
        };
        reader.readAsText(e.target.files[0]);
        handleClose()
    };

    const selectFile = () => {
        fileInput.current.click()
    }

    const queryClient = useQueryClient()
    const importDbmlMutation = useMutation(importProjectDbml, {
        onSuccess: () => {
            queryClient.invalidateQueries(['projectTables'])
        }
    })

    const allTableQuery = useListTablesDetail({projectId: project.id}, {
        enabled: false
    })

    const dbmlProjectQuery = useProjectDBML({projectId: project.id}, {
        enabled: false
    })

    const syncDatabaseMutation = useMutation(syncDatabase)

    const generateSqliteCol = (col) => {
        let name = col.name
        let type = col.type
        if (type.includes("int")) {
            type = "integer"
        }
        let isUnique = col.isUniqueKey
        let isPrimary = col.isPrimaryKey
        let isAutoIncrement = col.isAutoIncrement
        let isNull = col.isNull
        let header = `\t${name} ${type}`
        if (isUnique) header += ` unique`
        if (isPrimary) header += ` primary key`
        if (isAutoIncrement) header += ` autoincrement`
        if (isNull) header += ` not null`
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
        } else {
            // 生成dbml 然后生成sql 进行插入
            dbmlProjectQuery.refetch().then(res  => {
                let sql;
                if (activeDatabase === 1) {
                    sql = 'mysql'
                } else if (activeDatabase === 2){
                    sql = 'postgres'
                } else if (activeDatabase === 3) {
                    sql ='mssql'
                }

                console.log("当前数据库", sql, res.data.data)

                let lang = exporter.export(res.data.data.data, sql);
                // 插入
                syncDatabaseMutation.mutate({
                    projectId: project.id,
                    sql: lang,
                    dbType: activeDatabase
                }, {
                    onSuccess: () => {
                        toast(`同步${sql}成功`)
                    }
                })

            })
        }
        setAnchorEl(false)
        toast("同步数据库成功")
    }

    const handleExportSql = () => {
        dbmlProjectQuery.refetch().then(res => {
            let data = res.data.data.data
            // exporter.export(res.)
        })
    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                菜单
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    selectFile();
                    // handleClose();
                }}>导入SQL</MenuItem>
                <input type={'file'} style={{display: "none"}} ref={fileInput} onChange={showFile}/>

                <MenuItem onClick={handleExportSql}>导出SQL</MenuItem>
                <MenuItem onClick={() => handleSyncDatabase()}>同步数据库</MenuItem>
            </Menu>
        </div>
    );
}
