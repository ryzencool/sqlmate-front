import React, {useState} from 'react'
import Button from "@mui/material/Button";
import {Card, Chip, Dialog, DialogActions, DialogContent, SpeedDial, SpeedDialIcon, TextField} from "@mui/material";
import {useListCodeTemplate} from "../../store/rq/reactQueryStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addCodeTemplate} from "../../api/dbApi";
import {useNavigate} from "react-router";


export default function CodeSettings() {

    const navigate = useNavigate()

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const codeTemplates = useListCodeTemplate()

    const queryClient = useQueryClient()
    const handleSubmitTemplate = useMutation(addCodeTemplate, {
        onSuccess: () => {
            queryClient.invalidateQueries("codeTemplates")
        }
    })

    const [templateSubmit, setTemplateSubmit] = useState({})

    if (codeTemplates.isLoading) {
        return <div>加载中</div>
    }

    return <div>
        <div className={"flex flex-row gap-10"}>
            {
                !codeTemplates.isLoading && codeTemplates.data.data?.data.map(
                    it => (
                        <Card key={it.id} className={"w-52 h-80"}
                        >
                            <div className={'h-4/6 bg-purple-300 '}>

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
                                        <Button
                                            onClick={() => navigate(`/header/dashboard/codeTemplateEdit/${it.id}`)}>点击进入</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                )
            }
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
