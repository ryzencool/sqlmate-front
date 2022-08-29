import React, {useEffect, useState} from "react";
import {activeTableAtom} from "../../store/tableListStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createTable, updateProject} from "../../api/dbApi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useGetProject, useListDefaultColumnTemplate, useListTables} from "../../store/rq/reactQueryStore";
import {useAtom} from "jotai";
import {databaseTypeAtom} from "../../store/databaseStore";
import FormInputText from "../../components/form/FormInputText";
import {useForm} from "react-hook-form";
import FormSelect from "../../components/form/FormSelect";

function DBTablePanel({projectId}) {

    const queryClient = useQueryClient()
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [tableCreateOpen, setTableCreateOpen] = useState(false)
    const [searchParam, setSearchParam] = useState({projectId: projectId});
    const [databaseType, setDatabaseType] = useAtom(databaseTypeAtom)
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

    const projectMutation = useMutation(updateProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['project'])
        }

    })

    const handleSelectDbType = (evt) => {
        let dbType = evt.target.value
        console.log(dbType)
        projectMutation.mutate({
            id: projectId,
            dbType: dbType
        }, {
            onSuccess: data => {
                setDatabaseType(dbType)
            }
        })

    }

    const submitCreateTableForm = (data, reset) => {
        tableCreateMutation.mutate({
            ...data,
            projectId: projectId
        }, {
            onSuccess: data => {
                setTableCreateOpen(false)
                reset({})
            }
        })

    }

    if (tablesQuery.isLoading || projectQuery.isLoading ) {
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
                <div className={"flex flex-row gap-2 justify-between w-10/12 mt-2"}>
                    <FormControl className={"w-1/2"} size="small">
                        <InputLabel>DB</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={databaseType}
                            label="Age"
                            onChange={handleSelectDbType}
                        >

                            <MenuItem value={0}>Sqlite</MenuItem>
                            <MenuItem value={1}>Mysql</MenuItem>
                            <MenuItem value={2}>Postgresql</MenuItem>
                        </Select>
                    </FormControl>
                    <Button className={"bg-black text-white w-1/2"} onClick={() => {
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
                        <ListItem key={it.id} disablePadding onClick={() => {
                            setActiveTable(it.id)

                        }}>
                            {
                                <ListItemButton
                                    className={`rounded-lg ${it.id === activeTable ? "bg-slate-200" : "bg-white"}`}>
                                    <ListItemText primary={it.name}/>
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
                <Button type={"submit"} >确定</Button>
            </DialogActions>
        </form>

    </Dialog>
}
