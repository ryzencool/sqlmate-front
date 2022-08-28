import React, {useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, TextField} from "@mui/material";
import {CopyBlock, nord} from "react-code-blocks";
import CodeMirror from "@uiw/react-codemirror";
import {sql} from "@codemirror/lang-sql";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addProjectSql, deleteProjectSql, executeSql, queryOptimizer, updateProjectSql} from "../api/dbApi";
import {useListProjectSql} from "../store/rq/reactQueryStore";
import AlertDialog from "./AlertDialog";
import Box from "@mui/material/Box";
import {useAtom} from "jotai";
import {databaseTypeAtom} from "../store/databaseStore";


export default function DBDdl() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const [code, setCode] = useState('')
    const [sqlName, setSqlName] = useState("")
    const [projectSqlState, setProjectSqlState] = useState({});
    const handleClose = () => {
        setOpen(false);
    };

    const queryClient = useQueryClient()

    const [optimizerParam, setOptimizerParam] = useState({})

    const optimizer = useQuery(["queryOptimizer", optimizerParam],
        () => queryOptimizer(queryOptimizer), {
            enabled: !!optimizerParam
        })

    const projectSqls = useListProjectSql({projectId: 1})

    const slqUpdateMutation = useMutation(updateProjectSql, {
            onSuccess: () => {
                queryClient.invalidateQueries("projectSqls")
            }
        }
    )


    const [deleteSqlOpen, setDeleteSqlOpen] = useState(false)

    const deleteSqlMutation = useMutation(deleteProjectSql, {
        onSuccess: () => {
            queryClient.invalidateQueries(['projectSqls'])
        }
    })

    const [drawerOpen, setDrawerOpen] = useState(false)

    const [databaseType, setDatabaseType] = useAtom(databaseTypeAtom)

    const executeSqlMutation = useMutation(executeSql, {
        onSuccess: (data) => {
            setDrawerOpen(true)
        }
    })

    const handleDrawerClose = () => {
        setDrawerOpen(false)
    }

    const handleExecute = (projectSql) => {
        if (databaseType === 1) {

        } else {
            console.log("点击了执行了")
            executeSqlMutation.mutate({
                sql: projectSql.sql
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

    return <div className={"w-full flex flex-col gap-5 "}>
        <div className={'w-full flex flex-row justify-between'}>
            <TextField size={"small"} className={"w-full"} label={"搜索"}/>
        </div>
        <div>

            <div>
                <div className={'flex flex-col gap-4'}>

                    {
                        !projectSqls.isLoading && projectSqls.data.data.data.map(it => {
                            return (
                                <div className={'flex flex-col gap-3 border-b pb-4'} key={it.id}>
                                    <div className={'font-bold'}>{it.name}</div>
                                    <CopyBlock
                                        text={it.sql}
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
                                            setDrawerOpen(true)
                                        }}>调优</Button>
                                        <Button variant={'contained'} size={'small'}
                                                onClick={() => setDeleteSqlOpen(true)}>删除sql</Button>
                                        <Button variant={'contained'} size={'small'}
                                                onClick={() => {
                                                    handleExecute(it)
                                                }}>执行sql</Button>
                                        <Button variant={'contained'} size={'small'}
                                                onClick={() => {
                                                    handleClickOpen()
                                                    setProjectSqlState(it)
                                                }}>编辑sql</Button>
                                        <Button variant={'contained'} size={'small'} onClick={() => {
                                            handleExplain(it)
                                        }
                                        }>explain</Button>
                                    </div>
                                    <AlertDialog open={deleteSqlOpen} title={"确认删除当前的sql?"}
                                                 handleClose={() => setDeleteSqlOpen(false)}
                                                 confirm={() => {
                                                     deleteSqlMutation.mutate({
                                                         id: it.id
                                                     })
                                                 }}/>

                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
        <TemporaryDrawer open={drawerOpen} handleClose={() => handleDrawerClose()} element={<div>

        </div>}/>


        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>添加sql</DialogTitle>
            <DialogContent sx={{width: '600px', display: "flex", flexDirection: "column", alignItems: "center"}}>
                <TextField sx={{width: '550px', marginTop: '10px'}}
                           label={"名称"}
                           value={projectSqlState.name} onChange={(evt) => {
                    setProjectSqlState({...projectSqlState, name: evt.target.value})
                }
                } size={"small"}/>

                <Box sx={{marginTop: '10px'}}>
                    <CodeMirror
                        height={"300px"}
                        width={'550px'}
                        theme={"dark"}
                        value={projectSqlState.sql}
                        onChange={e => {
                            setProjectSqlState({
                                ...projectSqlState,
                                sql: e
                            })
                        }
                        }
                        extensions={[sql()]}
                        className={"rounded-2xl"}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={() => {
                    slqUpdateMutation.mutate({
                        id: projectSqlState.id,
                        sql: projectSqlState.sql,
                        name: projectSqlState.name
                    })
                    setOpen(false)
                    setProjectSqlState({})
                }}>提交</Button>
            </DialogActions>
        </Dialog>

    </div>
}


function TemporaryDrawer({open, handleClose, element}) {


    return (
        <div>
            <React.Fragment key={"right"}>
                <Drawer

                    anchor={"right"}
                    open={open}
                    onClose={handleClose}
                >
                    {element}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
