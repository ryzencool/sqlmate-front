import React, {useState} from "react";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTable} from "../../../api/dbApi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemText, TextField} from "@mui/material";
import {useGetProject, useListTables} from "../../../store/rq/reactQueryStore";
import {useAtom} from "jotai";
import {activeDbTypeAtom} from "../../../store/jt/databaseStore";
import {FiMoreVertical} from "react-icons/fi";
import {TableCreateDialog} from "./TableCreateDialog";
import {TableMenus} from "./TableMenus";

function DBTablePanel({projectId}) {

    const queryClient = useQueryClient()
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [tableCreateOpen, setTableCreateOpen] = useState(false)
    const [searchParam, setSearchParam] = useState({projectId: projectId});
    const [databaseType, setDatabaseType] = useAtom(activeDbTypeAtom)
    const [tableMenuAnchorEl, setTableMenuAnchorEl] = useState(null)
    const tableMenuOpen = Boolean(tableMenuAnchorEl)
    const projectQuery = useGetProject({id: projectId}, {
        onSuccess: data => {
            setDatabaseType(data.data.data.dbType)
        }
    })
    console.log("项目吧", projectId)
    const tablesQuery = useListTables(searchParam, {
        enabled: !!projectId
    })

    const tableCreateMutation = useMutation(createTable, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['projectTables'])
        }
    })


    const submitCreateTableForm = (data, reset) => {
        tableCreateMutation.mutate({
            ...data,
            projectId: projectId
        }, {
            onSuccess: data => {
                console.log("创建的id", data.data.data)
                setTableCreateOpen(false)
                setActiveTable(data.data.data)
                reset({})
            }
        })

    }

    const closeTableMenu = () => {
        setTableMenuAnchorEl(null)
    }

    if (tablesQuery.isLoading || projectQuery.isLoading) {
        return <div>加载中</div>
    }


    return (
        <div>
            <div className="flex flex-col items-center h-20 w-full gap-2 ">
                <div className={"relative flex flex-row items-center justify-between w-10/12"}>
                    <div className={'w-full flex flex-row justify-between'}>
                        <TextField size={"small"} className={"w-full"} label={"搜索"} onChange={(e) => {
                            setSearchParam({
                                tableName: e.target.value
                            })
                        }}/>
                    </div>
                </div>
                <div className={"flex flex-row gap-2 justify-between w-10/12 mt-1"}>
                    <Button className={"p-2 bg-black text-white w-full tracking-widest rounded-lg"} onClick={() => {
                        setTableCreateOpen(true)
                    }}>
                        创建表
                    </Button>
                    <TableCreateDialog
                        value={{defaultColumnTemplateId: projectQuery.data.data.data.defaultColumnTemplateId}}
                        closeDialog={() => setTableCreateOpen(false)}
                        open={tableCreateOpen}
                        submitForm={submitCreateTableForm}/>
                </div>

            </div>
            <Box className={"w-full flex flex-col  items-center text-sm "}>
                <List className={"w-10/12 overflow-auto mt-4 h-[calc(100vh-11rem)]"}>

                    {tablesQuery.data.data.data.map(it => (
                        <ListItem key={it.id} disablePadding>
                            {
                                <ListItemButton
                                    className={`rounded-lg ${it.id === activeTable ? "bg-slate-200" : "bg-white"}`}
                                    onClick={() => {
                                        setActiveTable(it.id)
                                    }}>
                                    <ListItemText primary={it.name}/>
                                    <div
                                        onClick={(event) => {
                                            event.stopPropagation()

                                            setTableMenuAnchorEl(event.currentTarget)

                                        }}
                                        className={'bg-sky-200 p-2 rounded-lg transition delay-150 duration-300 ease-in-out'}>
                                        <FiMoreVertical/>
                                    </div>
                                    <TableMenus
                                        tableId={it.id}
                                        open={tableMenuOpen}
                                        anchorEl={tableMenuAnchorEl}
                                        handleCloseMenu={closeTableMenu}/>
                                </ListItemButton>
                            }

                        </ListItem>))
                    }
                </List>
            </Box>
        </div>
    );
}

export default DBTablePanel;



