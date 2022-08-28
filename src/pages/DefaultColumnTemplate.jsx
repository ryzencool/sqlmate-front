import React, {useEffect, useState} from 'react'
import {Card, Dialog, DialogActions, DialogContent, DialogTitle, SpeedDial, SpeedDialIcon} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import {useListDefaultColumnTemplate} from "../store/rq/reactQueryStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addDefaultColumnTemplate} from "../api/dbApi";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../store/projectStore";
import {useForm} from "react-hook-form";
import FormInputText from "../components/FormInputText";

export default function DefaultColumnTemplate(props) {

    const navigate = useNavigate()
    const [project, setProject] = useAtom(activeProjectAtom)

    const [columnTemplateSearch, setColumnTemplateSearch] = useState({});
    const [addTemplateOpen, setAddTemplateOpen] = useState(false);
    const queryClient = useQueryClient()

    const listTemplateQuery = useListDefaultColumnTemplate(columnTemplateSearch)

    const addTemplateMutation = useMutation(addDefaultColumnTemplate, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['defaultColumnTemplates'])
        }
    })

    const submitAddTemplate = (data) => {
        addTemplateMutation.mutate({
            ...data
        })
        setAddTemplateOpen(false)
    }

    if (listTemplateQuery.isLoading) {
        return <div>加载中</div>
    }


    return <div>

        <div className={'flex flex-row flex-wrap gap-8'}>
            {listTemplateQuery.data.data.data.map(it => (
                <Card className={'w-52 h-72 flex flex-col gap-2'}>
                    <div className={'h-2/3  w-full bg-purple-300'}>
                    </div>

                    <div className={'pl-2'}>
                        <div className={'font-bold'}>{it.name}</div>
                        <div className={'text-sm text-slate-500'}>{it.note}</div>
                    </div>

                    <div className={'flex flex-row justify-end p-2'}>
                        <Button
                            onClick={() => navigate(`/header/dashboard/defaultColumnTemplate/detail/${it.id}`)}>详情</Button>
                    </div>
                </Card>))}
        </div>


        <div>
            <SpeedDial onClick={() => {
                setAddTemplateOpen(true)
            }}
                       ariaLabel="SpeedDial basic example"
                       sx={{position: 'absolute', bottom: 100, right: 100}}
                       icon={<SpeedDialIcon/>}
            >
            </SpeedDial>
        </div>
        <EditTemplateDialog mode={1}
                            closeDialog={() => setAddTemplateOpen(false)}
                            open={addTemplateOpen} submitForm={submitAddTemplate}/>


    </div>

}

const EditTemplateDialog = ({mode, value, open, closeDialog, submitForm}) => {


    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        reset(value)
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>

        <DialogTitle>{mode === 1 ? '创建模版' : "编辑模版"}</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            submitForm(data)
            reset({})
        })}>
            <DialogContent>
                <FormInputText name={"name"} control={control} label={"模版名称"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    closeDialog();
                    reset({});
                }}>取消</Button>
                <Button type={"submit"} >确定</Button>
            </DialogActions>
        </form>
    </Dialog>;
}
