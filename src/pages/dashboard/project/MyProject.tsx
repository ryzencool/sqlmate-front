import React, {useEffect, useState} from 'react'
import {useListDefaultColumnTemplate, useListMyProject, useListTeam} from "../../../store/rq/reactQueryStore";
import {Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, SpeedDial, SpeedDialIcon} from "@mui/material";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addProject, updateProject} from "../../../api/dbApi";
import FormInputText from "../../../components/form/FormInputText";
import FormSelect from "../../../components/form/FormSelect";
import FormMultiSelect from "../../../components/form/FormMultiSelect";
import FormCheckBox from "../../../components/form/FormCheckBox";
import {FaRegClone, FaRegEye, FaRegHeart} from "react-icons/fa";
import {useAtom} from "jotai";
import {activeTableAtom} from "../../../store/jt/tableListStore";
import {colors} from "./ProjectCard";
import {DB_TYPE_List} from "../../../constant/dbConstant";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {activeDbTypeAtom} from "../../../store/jt/databaseStore";

export default function MyProject() {
    const navigate = useNavigate()
    const [search, setSearch] = useState({})
    const [project, setProject] = useAtom(activeProjectAtom)
    const [dbType, setDbType] = useAtom(activeDbTypeAtom)
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
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
        setActiveTable(0)
        setProject(it)
        setDbType(it.dbType)
        navigate(`/console/project/${it.id}`)
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
        }, {
            onSuccess: data => {
                setProjectCreateOpen(false)
            }
        })
    }

    const submitUpdateProjectForm = (data, id) => {
        projectUpdateMutation.mutate({
            ...data,
            id: id
        }, {
            onSuccess: res => {
                setProjectUpdateOpen(false)

            }
        })
    }

    if (myProjects.isLoading) {
        return <div>加载中</div>
    }


    return (<Box>
        <div className={"flex flex-row gap-8 flex-wrap mb-10"}>
            {
                myProjects.data.data.data.map(it =>
                    <Card className={"w-56 h-96 flex  flex-col  rounded-xl justify-between "} key={it.id}>
                        <div>
                            <div
                                className={`h-16 w-full  flex items-center pl-4 ${colors[it.name.length % 6]}`}>
                                <div className={"font-bold text-2xl"}> {it.name}</div>
                            </div>
                            <div className={"flex-col flex  w-full pl-4 pr-4 pt-4 "}>
                                <div>
                                    <div className={'flex-row flex justify-around gap-1 w-full'}>
                                        <div className={'flex-col items-center flex gap-1'}>
                                            <FaRegClone className={'text-lg'}/>
                                            <div className={'text-sm'}>{it.cloneCount}</div>
                                        </div>
                                        <div className={'flex-col items-center flex gap-1'}>
                                            <FaRegEye className={'text-lg'}/>
                                            <div className={'text-sm'}>{it.openCount}</div>
                                        </div>
                                        <div className={'flex-col items-center flex gap-1'}>
                                            <FaRegHeart className={'text-lg'}/>
                                            <div className={'text-sm'}>{it.collectCount}</div>
                                        </div>
                                    </div>
                                    <div className={'text-sm text-slate-400 mt-4'}>
                                        {it.note}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={'pl-4 pr-4 relative mb-2 flex-col flex justify-between '}>
                            <div>
                                <div className={'flex flex-row gap-4 mt-4'}>
                                    <div className={'font-bold text-sm'}>数据库</div>
                                    <div
                                        className={'text-sm'}>{DB_TYPE_List.find(itt => itt.key === it.dbType).value}</div>
                                </div>

                                <div className={'flex flex-row gap-0.5 flex-wrap'}>
                                    {
                                        !!it.tags && it.tags.map(tag => (
                                            <Chip label={tag} size={'small'} className={'mt-1'} key={tag}/>
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
            {/* @ts-expect-error TS(2741) FIXME: Property 'value' is missing in type '{ mode: numbe... Remove this comment to see the full error message */}
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

    const tagSelections = ["Go", "GORM", "Java", "Mybatis", "MybatisPlus"].map(it => ({
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
                reset()
            })}>
                <DialogContent>
                    <FormInputText name={"name"} control={control} label={"项目名称"}/>
                    <FormInputText name={"note"} control={control} label={"项目备注"}/>
                    <FormSelect name={'dbType'} control={control} label={'偏好数据库'}
                                choices={DB_TYPE_List}
                                hasDefaultNull={false}/>
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
