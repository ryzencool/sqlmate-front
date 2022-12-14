import React, {useEffect, useState} from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    SpeedDial,
    SpeedDialIcon,
    TextField
} from "@mui/material";
import {CopyBlock, nord} from "react-code-blocks";
import {sql} from "@codemirror/lang-sql";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addProjectSql, deleteProjectSql, executeSql, queryOptimizer, updateProjectSql} from "../../../api/dbApi";
import {useListProjectSql} from "../../../store/rq/reactQueryStore";
import AlertDialog from "../../../components/dialog/AlertDialog";
import {useAtom} from "jotai";
import {activeDbTypeAtom} from "../../../store/jt/databaseStore";
import {TemporaryDrawer} from "../../../components/drawer/TemporaryDrawer";
import FormInputText from "../../../components/form/FormInputText";
import {useForm} from "react-hook-form";
import FormCodeMirror from "../../../components/form/FormCodeMirror";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {format} from "sql-formatter";
import toast from "react-hot-toast";
import {OptimizeDrawer} from "../terminal/OptimizeDrawer";


export default function DBSql() {
    const [open, setOpen] = React.useState(false);
    const [addSqlOpen, setAddSqlOpen] = useState(false);
    const [project] = useAtom(activeProjectAtom);
    const [dbType] = useAtom(activeDbTypeAtom);
    const [searchParam, setSearchParam] = useState({projectId: project.id})
    const [optimizeOpen, setOptimizeOpen] = useState(false)
    const [optimizeResult, setOptimizeResult] = useState(null)
    const [projectSqlState, setProjectSqlState] = useState({});
    const [optimizerParam, setOptimizerParam] = useState({})

    const handleCloseAddSql = () => {
        setAddSqlOpen(false)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };


    const queryClient = useQueryClient()


    const projectSqlsQuery = useListProjectSql(searchParam, {
        enabled: !!project.id
    })

    const optimizeSqlMutation = useMutation(queryOptimizer)

    const slqUpdateMutation = useMutation(updateProjectSql, {
            onSuccess: () => {
                queryClient.invalidateQueries("projectSqls")
            }
        }
    )

    const sqlAddMutation = useMutation(addProjectSql, {
        onSuccess: () => {
            queryClient.invalidateQueries(["projectSqls"])
        }
    })


    const [deleteSqlOpen, setDeleteSqlOpen] = useState(false)

    const deleteSqlMutation = useMutation(deleteProjectSql, {
        onSuccess: () => {
            queryClient.invalidateQueries(['projectSqls'])
        }
    })

    const [drawerOpen, setDrawerOpen] = useState(false)

    const [databaseType, setDatabaseType] = useAtom(activeDbTypeAtom)

    const executeSqlMutation = useMutation(executeSql, {
        onSuccess: (data) => {
            setDrawerOpen(true)
        }
    })

    const handleDrawerClose = () => {
        setDrawerOpen(false)
    }

    const handleClickOptimizeSql = (it) => {
        console.log("??????")
        if (databaseType === 0) {
            toast.error("Sqlite??????????????????");
        } else {
            optimizeSqlMutation.mutate({
                projectId: project.id,
                sql: it.sql,
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

    const handleExecute = (projectSql) => {
        if (databaseType === 1) {

        } else {
            console.log("??????????????????")
            executeSqlMutation.mutate({
                sql: projectSql.sql,
                projectId: project.id,
                dbType: dbType
            })
        }
    }

    const handleExplain = (projectSql) => {
        // sqlite
        if (databaseType === 1) {

        } else {
            // other database

        }
    }

    const handleSearch = (e) => {
        let value = e.target.value
        console.log("??????", value)
        setSearchParam({
            projectId: project.id,
            condition: value
        })
    }

    if (projectSqlsQuery.isLoading) {
        return <div>?????????</div>
    }

    return <div className={"w-full flex flex-col gap-5 "}>
        <div className={'w-full flex flex-row justify-between'}>
            <TextField size={"small"} className={"w-full"} label={"??????"} onChange={handleSearch}/>
        </div>

        <div>
            <div className={'flex flex-col gap-4'}>

                {
                    projectSqlsQuery.data.data.data.map(it => {
                        return (
                            <div className={'flex flex-col gap-3 border-b pb-4'} key={it.id}>
                                <div className={'font-bold'}>{it.name}({it.functionName})</div>
                                <CopyBlock
                                    text={format(it.sql)}
                                    theme={nord}
                                    language={"sql"}
                                    customStyle={
                                        {
                                            padding: "10px",
                                            width: "100%",
                                        }
                                    }
                                />
                                <div className={'flex flex-row gap-2'}>
                                    <Button variant={'contained'} size={'small'} onClick={() => {
                                        handleClickOptimizeSql(it)
                                    }}>??????</Button>
                                    <Button variant={'contained'} size={'small'}
                                            onClick={() => setDeleteSqlOpen(true)}>??????sql</Button>
                                    <Button variant={'contained'} size={'small'}
                                            onClick={() => {
                                                handleExecute(it)
                                            }}>??????sql</Button>
                                    <Button variant={'contained'} size={'small'}
                                            onClick={() => {
                                                handleClickOpen()
                                                setProjectSqlState(it)
                                            }}>??????sql</Button>
                                    <Button variant={'contained'} size={'small'} onClick={() => {
                                        handleExplain(it)
                                    }
                                    }>explain</Button>
                                </div>
                                <AlertDialog open={deleteSqlOpen} title={"?????????????????????sql?"}
                                             handleClose={() => setDeleteSqlOpen(false)}
                                             confirm={() => {
                                                 deleteSqlMutation.mutate({
                                                     id: it.id
                                                 }, {
                                                     onSuccess: data => {
                                                         toast("????????????")
                                                         setDeleteSqlOpen(false)
                                                     }
                                                 })
                                             }}/>

                            </div>
                        )
                    })
                }

            </div>
        </div>
        <TemporaryDrawer open={optimizeOpen}
                         handleClose={() => {
                             setOptimizeOpen(false)
                         }}
                         dir={"right"}
                         element={<OptimizeDrawer data={optimizeResult}/>}/>
        <TemporaryDrawer open={drawerOpen} handleClose={() => handleDrawerClose()} element={<div>

        </div>}/>

        <div>
            <SpeedDial
                onClick={() => {
                    setAddSqlOpen(true)
                }}
                ariaLabel="SpeedDial basic example"
                sx={{position: 'absolute', bottom: 80, right: 80}}
                icon={<SpeedDialIcon/>}
            >
            </SpeedDial>
            <EditSqlDialog closeDialog={handleCloseAddSql} mode={1} open={addSqlOpen} submitForm={(data, reset) => {
                sqlAddMutation.mutate({
                    ...data,
                    projectId: project.id
                }, {
                    onSuccess: () => {
                        handleCloseAddSql()
                        reset()
                    }
                })
            }
            }/>
        </div>

    </div>
}

export function EditSqlDialog({mode, value, open, closeDialog, submitForm}) {

    const {handleSubmit, reset, control} = useForm()


    useEffect(() => {
        if (value != null) {
            reset(value)
        }
    }, [value])

    return <Dialog open={open} onClose={() => {
        closeDialog()
        reset()
    }
    }>
        <DialogTitle>{mode === 1 ? "??????sql" : "??????sql"}</DialogTitle>

        <form onSubmit={handleSubmit(data => {
            submitForm(data, reset)
            closeDialog()
        })}>
            <DialogContent sx={{width: '600px', display: "flex", flexDirection: "column"}}>
                <FormInputText name={"name"} label={"SQL??????"} control={control}/>
                <FormInputText name={"functionName"} label={"????????????"} control={control}/>
                <Box sx={{textAlign: "left", marginTop: "10px"}}>
                    <Typography sx={{fontWeight: "bold"}}>SQL</Typography>
                </Box>
                <FormCodeMirror name={"sql"} control={control} extensions={[sql()]}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({})
                }}>??????</Button>
                <Button type={"submit"}>??????</Button>
            </DialogActions>
        </form>
    </Dialog>
}



