import React, {useEffect, useState} from 'react'
import {useListDefaultColumnTemplate, useListMyProject, useListTeam} from "../store/rq/reactQueryStore";
import {Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, SpeedDial, SpeedDialIcon} from "@mui/material";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addProject, updateProject} from "../api/dbApi";
import FormInputText from "../components/FormInputText";
import FormSelect from "../components/FormSelect";
import FormMultiSelect from "../components/FormMultiSelect";
import FormCheckBox from "../components/FormCheckBox";


export default function MyProject() {
    const navigate = useNavigate()
    const [search, setSearch] = useState({})
    const myProjects = useListMyProject(search)
    const [projectCreateOpen, setProjectCreateOpen] = useState(false)
    const [projectUpdateOpen, setProjectUpdateOpen] = useState(false)
    const queryClient = useQueryClient()
    const projectCreateMutation = useMutation(addProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['myProjects'])
        }
    })

    const projectUpdateMutation = useMutation(updateProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['myProjects'])
        }
    })

    const handleCloseProjectCreateDialog = () => {
        setProjectCreateOpen(false)
    }
    const handleClickProjectDetail = (it) => {
        navigate(`/header/home/${it.id}`)
    }
    const handleCloseProjectSetting = () => {
        setProjectUpdateOpen(false)
    }
    const handleClickSetProject = () => {
        setProjectUpdateOpen(true)
    }
    const submitCreateProjectForm = (data) => {
        projectCreateMutation.mutate({
            ...data
        })
        setProjectCreateOpen(false)
    }

    const submitUpdateProjectForm = (data, id) => {
        projectUpdateMutation.mutate({
            ...data,
            id: id
        })
        setProjectUpdateOpen(false)
    }

    if (myProjects.isLoading) {
        return <div>加载中</div>
    }


    return (<Box>
        <div className={"flex flex-row gap-8 flex-wrap mb-10"}>
            {
                myProjects.data.data.data.map(
                    it => <Card className={"w-52 h-80 flex  flex-col justify-between"} key={it.id}   >
                        <div className={"h-1/2 "}>
                            <img  className={'w-full h-full object-cover'} src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/pexels-pixabay-162318.jpg"}/>
                        </div>
                        <div className={"pl-2 pt-2 pb-1 flex-col flex "}>
                            <div className={" font-bold "}>
                                {it.name}
                            </div>
                            <div className={'text-sm text-slate-400'}>
                                {it.note}
                            </div>
                            <div className={'mt-2 flex flex-row flex-wrap gap-1 '}>
                                {
                                    !!it.tags && it.tags.map(tag => (
                                        <Chip label={tag} size={'small'}/>
                                    ))
                                }


                            </div>

                        </div>
                        <div className={'mt-2 w-full flex-row flex justify-end gap-1 mb-2'}>
                            <Button size={"small"} onClick={handleClickSetProject}>设置</Button>
                            <EditProjectDialog value={it} mode={2}
                                               closeDialog={handleCloseProjectSetting}
                                               open={projectUpdateOpen}
                                               submitForm={(data) => submitUpdateProjectForm(data, it.id)}/>
                            <Button size={"small"} onClick={() => handleClickProjectDetail(it)}>详情</Button>
                        </div>
                    </Card>
                )
            }

        </div>
        <div>
            <SpeedDial onClick={() => setProjectCreateOpen(true)}
                       ariaLabel="SpeedDial basic example"
                       sx={{position: 'absolute', bottom: 80, right: 80}}
                       icon={<SpeedDialIcon/>}
            >

            </SpeedDial>
            <EditProjectDialog mode={1} closeDialog={handleCloseProjectCreateDialog}
                               open={projectCreateOpen}
                               submitForm={submitCreateProjectForm}/>
        </div>


    </Box>)
}


function EditProjectDialog({mode, value, open, closeDialog, submitForm}) {
    // 获取所有的默认模版才行
    const defaultColumnTemplateQuery = useListDefaultColumnTemplate({})
    const teamsQuery = useListTeam()
    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        if (value != null) {
            reset(value)
        }
    }, [value])

    if (defaultColumnTemplateQuery.isLoading || teamsQuery.isLoading) {
        return <div>加载中</div>
    }

    const templateSelections = defaultColumnTemplateQuery.data.data.data.map(it => ({
        key: it.id,
        value: it.name
    }))

    const teamSelections = teamsQuery.data.data.data.map(it => ({
        key: it.id,
        value: it.name
    }))

    const tagSelections = ["mysql", "postgresql", "mssql", "sqlite", "java", "springboot", "mybatis"].map(it => ({
        key: it,
        value: it
    }))

    return (
        <Dialog open={open} onClose={() => {
            closeDialog();
            reset({})
        }}>
            <DialogTitle>{mode === 1 ? "新增项目" : "修改项目"}</DialogTitle>
            <form onSubmit={handleSubmit((data) => {
                submitForm(data)
                reset({})
            })}>
                <DialogContent>
                    <FormInputText name={"name"} control={control} label={"项目名称"}/>
                    <FormInputText name={"note"} control={control} label={"项目备注"}/>
                    <FormSelect
                        name={"defaultColumnTemplateId"}
                        control={control}
                        label={"默认字段模版"}
                        choices={templateSelections}
                        hasDefaultNull={true}
                    />
                    <FormMultiSelect name={"teamIds"} label={'团队'} control={control} choices={teamSelections}/>
                    <FormMultiSelect name={"tags"} label={'标签'} control={control} choices={tagSelections}/>
                    <FormCheckBox control={control} label={'公开'} name={'isPublic'}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        closeDialog()
                        reset({})
                    }}>取消</Button>
                    <Button type={"submit"}>确定</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
