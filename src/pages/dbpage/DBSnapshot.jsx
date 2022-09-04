import React, {useEffect, useState} from 'react'
import {
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    SpeedDial,
    SpeedDialIcon,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../store/projectStore";
import {useListSnapshot, useProjectDBML} from "../../store/rq/reactQueryStore";
import {useForm} from "react-hook-form";
import FormInputText from "../../components/form/FormInputText";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createSnapshot} from "../../api/dbApi";
import {CodeResult, TemporaryDrawer} from "../../components/drawer/TemporaryDrawer";
import {format} from "sql-formatter";
import {exporter} from "@dbml/core";
import Box from "@mui/material/Box";
import {a11yProps, ZTabPanel} from "../../components/tab/ZTabPanel";
import beautify from "json-beautify";


export default function DBSnapshot() {


    const [activeProject, setActiveProject] = useAtom(activeProjectAtom)

    const [search, setSearch] = useState({
        projectId: activeProject.id
    });

    const [dmlDrawerOpen, setDmlDrawerOpen] = useState(false)


    const [dmlData, setDmlData] = useState('')

    const snapshotListQuery = useListSnapshot(search, {
        enabled: !!activeProject.id
    })

    const queryClient = useQueryClient()

    const projectDbmlQuery = useProjectDBML({
        projectId: activeProject.id
    }, {enabled: false})




    const createSnapMutation = useMutation(createSnapshot, {
        onSuccess: () => {
            queryClient.invalidateQueries(["projectSnapshots"])
        }
    })


    const [createSnapOpen, setCreateSnapOpen] = useState(false)

    if ( snapshotListQuery.isLoading ) {
        return <div>加载中</div>
    }

    console.log(snapshotListQuery.data.data)

    return <div className={'flex flex-col gap-4'}>
        <div className={'w-full flex flex-row justify-between'}>
            <TextField size={"small"} className={"w-full"} label={"搜索"} onChange={(e) => {
                setSearch({
                    projectId: activeProject.id,
                    name: e.target.value,
                    note: e.target.value
                })
            }
            }/>
        </div>
        <div className={'flex flex-col gap-4'}>
            {
                snapshotListQuery.data.data.data.map(snapshot =>
                    <Card key={snapshot.id} className={'flex flex-row '}>
                        <div className={'w-1/4 bg-purple-300'}>

                        </div>
                        <div className={'pt-2 pb-2 pl-4 flex flex-row justify-between items-center w-full'}>
                            <div className={'grid grid-rows-2 text-left'}>
                                <div className={'grid grid-cols-2'}>
                                    <div>快照名称</div>
                                    <div>{snapshot.name}</div>
                                </div>
                                <div className={'grid grid-cols-2'}>
                                    <div>快照备注</div>
                                    <div>{snapshot.note}</div>
                                </div>
                                <div className={'grid grid-cols-2'}>
                                    <div>快照人</div>
                                    <div>周美勇</div>
                                </div>
                                <div className={'grid grid-cols-2'}>

                                    <div>快照时间</div>
                                    <div>{snapshot.createTime}</div>
                                </div>
                            </div>
                            <div className={'mr-3 flex flex-col gap-4'}>
                                <Button size={'small'} variant={"contained"}>删除</Button>
                                <Button size={'small'} variant={'contained'}
                                        onClick={() => {
                                            setDmlData(snapshot.content)
                                            setDmlDrawerOpen(true);
                                        }}>查看详情</Button>

                            </div>
                        </div>

                    </Card>
                )
            }

        </div>
        <TemporaryDrawer open={dmlDrawerOpen}
                         handleClose={() => setDmlDrawerOpen(false)}
                         element={<CodePanel content={dmlData}/>}
        />

        <div>
            <SpeedDial onClick={() => {
                setCreateSnapOpen(true)

            }}
                       ariaLabel="SpeedDial basic example"
                       sx={{position: 'absolute', bottom: 100, right: 140}}
                       icon={<SpeedDialIcon/>}
            >
            </SpeedDial>
        </div>

        <EditSnapshotDialog mode={1} closeDialog={() => setCreateSnapOpen(false)}
                            submitForm={(data) => {
                                projectDbmlQuery.refetch().then(res => {
                                    let content = res.data.data.data
                                    console.log("生成数据", content)
                                    createSnapMutation.mutate({
                                        ...data,
                                        projectId: activeProject.id,
                                        content: content

                                    })
                                })

                            }} open={createSnapOpen}/>


    </div>

}

const EditSnapshotDialog = ({mode, value, open, closeDialog, submitForm}) => {


    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        reset(value)
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>

        <DialogTitle>{mode === 1 ? '创建快照' : "编辑快照"}</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            console.log("内部提交", data)
            submitForm(data)
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"快照名称"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>取消</Button>
                <Button type={"submit"} onClick={closeDialog}>确定</Button>
            </DialogActions>
        </form>
    </Dialog>;
}

function CodePanel({content}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log("内容是", content)

    let pg = "";
    try {
        pg = exporter.export(content, "postgres")
    } catch (e) {
        console.log("异常是",e.message)

    }
    let mysql = ""
    try {
        mysql = exporter.export(content, "mysql")
    } catch (e) {
        console.log("异常是",e)
    }
    let mssql = ""
    try {
        mssql = exporter.export(content, "mssql")
    } catch (e) {
        console.log("异常是",e.message)

    }
    let json = ""
    try {
        json = beautify(JSON.parse(exporter.export(content, "json")), null, 2, 100)
    } catch (e) {

    }


    return <Box sx={{width: '100%', paddingBottom: '20px'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="postgresql" {...a11yProps(0)} />
                <Tab label="mysql" {...a11yProps(1)} />
                <Tab label="mssql" {...a11yProps(2)} />
                <Tab label="json" {...a11yProps(3)} />
            </Tabs>
        </Box>
        <ZTabPanel value={value} index={0}>
            <CodeResult format={'sql'} content={pg}/>
        </ZTabPanel>
        <ZTabPanel value={value} index={1}>
            <CodeResult format={'sql'} content={mysql}/>

        </ZTabPanel>
        <ZTabPanel value={value} index={2}>
            <CodeResult format={'sql'} content={mssql}/>

        </ZTabPanel>
        <ZTabPanel value={value} index={3}>
            <CodeResult format={'json'} content={json}/>
        </ZTabPanel>
    </Box>
}
