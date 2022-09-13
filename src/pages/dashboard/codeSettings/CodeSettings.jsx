import React, {useEffect, useState} from 'react'
import Button from "@mui/material/Button";
import {
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    SpeedDial,
    SpeedDialIcon,
    TextField
} from "@mui/material";
import {useListCodeTemplate} from "../../../store/rq/reactQueryStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addCodeTemplate, cloneCodeTemplate} from "../../../api/dbApi";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import FormInputText from "../../../components/form/FormInputText";
import {colors} from "../project/ProjectCard";


export default function CodeSettings() {

    const navigate = useNavigate()

    const [open, setOpen] = React.useState(false);
    const [cloneOpen, setCloneOpen] = useState(false)
    const handleClose = () => {
        setOpen(false);
    };

    const codeTemplates = useListCodeTemplate()
    const [selectedTemplate, setSelectedTemplate] = useState({})
    const queryClient = useQueryClient()
    const handleSubmitTemplate = useMutation(addCodeTemplate, {
        onSuccess: () => {
            queryClient.invalidateQueries("codeTemplates")
        }
    })

    const cloneTemplateMutation = useMutation(cloneCodeTemplate, {
        onSuccess: () => {
            queryClient.invalidateQueries(["codeTemplates"])
        }
    })

    const [templateSubmit, setTemplateSubmit] = useState({})

    const handleClickClone = (it) => {
        setCloneOpen(true)
        setSelectedTemplate(it)
    }

    const handleCloseCloneDialog = () => {
        setCloneOpen(false)
    }

    const submitCloneForm = (data, reset) => {
        cloneTemplateMutation.mutate({
            ...data,
            templateId: selectedTemplate.id
        })
        reset({})
        handleCloseCloneDialog()
    }

    if (codeTemplates.isLoading) {
        return <div>加载中</div>
    }



    return <div>
        <div className={"flex flex-row gap-10"}>
            {
                !codeTemplates.isLoading && codeTemplates.data.data?.data.map(
                    it => (
                        <Card key={it.id} className={"w-52 h-80 rounded-xl "}
                        >
                            <div className={`h-4/6 bg-purple-300 ${colors[it.name.length % 6]}`}>

                            </div>
                            <div className={'h-2/6 p-2 flex flex-col justify-between'}>
                                <div className={"font-bold"}>
                                    {it.name}
                                </div>
                                <div className={'flex flex-row justify-between items-center'}>
                                    <div>
                                        <Chip label={it.lang} size={"small"}/>
                                    </div>
                                    <div>
                                        <Button size={"small"} onClick={() => handleClickClone(it)}>克隆</Button>

                                        <Button size={"small"}
                                                onClick={() => navigate(`/console/dashboard/codeTemplateEdit/${it.id}`)}>点击进入</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                )
            }
            <CloneDialog closeDialog={handleCloseCloneDialog} title={selectedTemplate.name}
                         open={cloneOpen}
                         submitForm={submitCloneForm}/>
        </div>
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="模版名称"
                    fullWidth
                    variant="standard"
                    onChange={e => {
                        setTemplateSubmit({
                            ...templateSubmit,
                            name: e.target.value
                        })
                    }
                    }
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="lang"
                    label="语言"
                    fullWidth
                    variant="standard"
                    onChange={e => {
                        setTemplateSubmit({
                            ...templateSubmit,
                            lang: e.target.value
                        })
                    }
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={() => {
                    handleSubmitTemplate.mutate({
                        ...templateSubmit,
                        projectId: 1
                    })
                    handleClose()
                }
                }>确定</Button>
            </DialogActions>
        </Dialog>
        <SpeedDial onClick={() => setOpen(true)}
                   ariaLabel="SpeedDial basic example"
                   sx={{position: 'absolute', bottom: 50, right: 50}}
                   icon={<SpeedDialIcon/>}
        >

        </SpeedDial>

    </div>
}

function CloneDialog({value, open, closeDialog, submitForm, title}) {

    const {handleSubmit, control, reset} = useForm({
        defaultValues: value
    })

    useEffect(() => {
        reset(value)
    }, [value])

    return <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>从<span>{title}</span>克隆</DialogTitle>
        <form onSubmit={handleSubmit(data => {
            console.log("内部提交", data)
            submitForm(data, reset)
        })}>
            <DialogContent>

                <FormInputText name={"name"} control={control} label={"模版名称"}/>
                <FormInputText name={"lang"} control={control} label={"编程语言"}/>
                <FormInputText name={"note"} control={control} label={"备注"}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>取消</Button>
                <Button type={"submit"} >确定</Button>
            </DialogActions>
        </form>
    </Dialog>;

}
