import React, {useState} from "react";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTable} from "../../../api/dbApi";
import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
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

    const isLoading = tablesQuery.isLoading || projectQuery.isLoading;

    if (isLoading) {
        return <div>加载中</div>
    }

    return (
        <div>
            <div className="flex flex-col items-center h-20 w-full gap-2 ">
                <div className={"relative flex flex-row items-center justify-between w-10/12"}>
                    <div className={'w-full flex flex-row justify-between'}>
                        <input type="text"
                               placeholder="搜索"
                               className="input input-bordered w-full max-w-xs" onChange={(e) => {
                            setSearchParam({
                                // @ts-expect-error TS(2345) FIXME: Argument of type '{ tableName: string; projectId: ... Remove this comment to see the full error message
                                tableName: e.target.value,
                                projectId: projectId
                            })
                        }}/>
                    </div>
                </div>
                <div className={"flex flex-row gap-2 justify-between w-10/12 mt-1"}>

                    <button className="btn btn-active w-full tracking-widest" onClick={() => {
                        setTableCreateOpen(true)
                    }}>创建表
                    </button>
                        <TableCreateDialog
                            value={{defaultColumnTemplateId: projectQuery.data.data.data.defaultColumnTemplateId}}
                            closeDialog={() => setTableCreateOpen(false)}
                            open={tableCreateOpen}
                            submitForm={submitCreateTableForm}/>

                </div>

            </div>
            <div className={"w-full flex flex-col  items-center text-sm h-[calc(100vh-11rem)] mt-8"}>
                <List className={"w-10/12 overflow-auto  "}>

                    { tablesQuery.data.data.data.map(it => (
                        <ListItem key={it.id} disablePadding>
                            {
                                <ListItemButton
                                    className={`rounded-lg ${it.id === activeTable ? "bg-slate-200" : "bg-white"}`}
                                    onClick={() => {
                                        setActiveTable(it.id)
                                    }}>
                                    <ListItemText primary={it.name}/>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            setTableMenuAnchorEl(event.currentTarget)
                                        }}
                                        className={'btn btn-sm'}>
                                        <FiMoreVertical/>
                                    </button>
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
            </div>
        </div>
    );
}

export default DBTablePanel;



