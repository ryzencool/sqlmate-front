import React, {useEffect, useState} from "react";
import {activeTableAtom} from "../../store/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTable, deleteTable} from "../../api/dbApi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    TextField
} from "@mui/material";
import {useGetProject, useListDefaultColumnTemplate, useListTables} from "../../store/rq/reactQueryStore";
import {useAtom} from "jotai";
import {activeDbTypeAtom} from "../../store/databaseStore";
import FormInputText from "../../components/form/FormInputText";
import {useForm} from "react-hook-form";
import FormSelect from "../../components/form/FormSelect";
import {FiMoreVertical} from "react-icons/fi";
import AlertDialog from "../../components/dialog/AlertDialog";

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
                                <ListItemButton onClick={() => {
                                    setActiveTable(it.id)
                                }}
                                                className={`rounded-lg ${it.id === activeTable ? "bg-slate-200" : "bg-white"}`}>
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
                                        handleClose={() => {
                                            setTableMenuAnchorEl(null)
                                        }}/>
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


function TableMenus({tableId, anchorEl, open, handleClose}) {

    const [setActiveTableId] = useAtom(activeTableAtom)

    const queryClient = useQueryClient();

    const tableDeleteMutation = useMutation(deleteTable, {
        onSuccess: () => {
            queryClient.invalidateQueries(["table"])
        }
    })

    const handleDeleteTable = () => {
        tableDeleteMutation.mutate({
            tableId: tableId
        }, {
            onSuccess: res => {
                setDeleteDialogOpen(false)
                setActiveTableId(0)
            }
        })
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)


    return <Menu
        size={'small'}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}
        sx={{marginTop: "3px"}}
    >
        <MenuItem sx={{fontSize: "12px"}} onClick={() => {
            setDeleteDialogOpen(true)
            // handleClose()
        }}>删除</MenuItem>
        <AlertDialog open={deleteDialogOpen}
                     handleClose={() => {
                         setDeleteDialogOpen(false)
                         handleClose()
                     }}
                     confirm={handleDeleteTable}
                     title={"删除"}
                     msg={"确认删除当前表吗"}/>
        <MenuItem sx={{fontSize: "12px"}} onClick={() => {
            handleClose()
        }}>编辑</MenuItem>

    </Menu>
}


function TableCreateDialog({value, open, closeDialog, submitForm}) {

    const {control, handleSubmit, reset} = useForm()
    const defaultColumTemplateQuery = useListDefaultColumnTemplate({})

    useEffect(() => {
        reset(value)
    }, [])

    if (defaultColumTemplateQuery.isLoading) {
        return <div>加载中</div>
    }
    const defaultColumnTemplates = defaultColumTemplateQuery.data.data.data.map(it => (
        {
            key: it.id,
            value: it.name
        }
    ))


    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>创建表</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data, reset)
        })}>
            <DialogContent>

                <FormInputText
                    control={control}
                    name={"name"}
                    label={"表名称"}
                />

                <FormInputText
                    control={control}
                    name={"note"}
                    label={"备注"}
                />

                <FormSelect name={"defaultColumnTemplateId"}
                            control={control}
                            label={"默认字段模版"}
                            hasDefaultNull={true}
                            choices={defaultColumnTemplates}/>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({})
                }}>取消</Button>
                <Button type={"submit"}>确定</Button>
            </DialogActions>
        </form>

    </Dialog>
}
