import React, {useState} from 'react'
import CodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {json} from "@codemirror/lang-json";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addTemplateFile, updateCodeTemplate, updateCodeTemplateFile} from "../../../api/dbApi";
import Box from "@mui/material/Box";
import {Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {autocompletion} from "@codemirror/autocomplete";
import {useParams} from "react-router-dom";
import {useGetCodeTemplate, useListTemplateFile} from "../../../store/rq/reactQueryStore";
import mustache from "mustache/mustache.mjs";
import toast from "react-hot-toast";
import {CodeResult, TemporaryDrawer} from "../../../components/drawer/TemporaryDrawer";
import {a11yProps, ZTabPanel} from "../../../components/tab/ZTabPanel";
import {xml} from "@codemirror/lang-xml";
import {java} from "@codemirror/lang-java";
import AddIcon from '@mui/icons-material/Add';

export default function CodeTemplateEdit() {
    const [transferFn, setTransferFn] = useState("")

    const [tableCode, setTableCode] = useState("")
    // 获取对应的表的数据，json
    const [tabValue, setTabValue] = React.useState(0);

    const tableObj = `{
    "name": "user",
    "fields": [{
        "increment": "true",
        "name": "age",
        "note": "",
        "not_null": "",
        "pk": "",
        "unique": "",
        "type": {
            "type_name": "int"
        }
    }]
}`
    const [previewCode, setPreviewCode] = useState("")
    const [codePreviewOpen, setCodePreviewOpen] = useState(false)
    const snake2Camel = (str) => {
        return str.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase())
    }

    const camel2Snake = (str) => {
        return str.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())
    }

    const firstUpperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [templateEditDialogOpen, setTemplateEditDialogOpen] = React.useState(false);
    const [fileName, setFileName] = React.useState("")
    const {id} = useParams()
    const handleClickOpen = () => {
        setTemplateEditDialogOpen(true);
    };

    const queryClient = useQueryClient()

    const templateFileAdd = useMutation(addTemplateFile, {
        onSuccess: () => {
            queryClient.invalidateQueries(["templateFiles"])
        }
    })

    const codeTemplateGetQuery = useGetCodeTemplate({
        id: id
    })


    const codeTemplateUpdate = useMutation(updateCodeTemplate, {
        onSuccess: () => {
            toast("同步成功", {
                position: "top-center"
            })
            queryClient.invalidateQueries(['template'])
            queryClient.invalidateQueries(['templateFiles'])
        }
    })

    const codeTemplateFileUpdate = useMutation(updateCodeTemplateFile, {
        onSuccess: () => {
            toast("同步成功", {
                position: "top-center"
            })
            queryClient.invalidateQueries(['templateFiles'])
        }
    })
    const templateFilesQuery = useListTemplateFile({templateId: id})

    const handleClose = () => {
        setTemplateEditDialogOpen(false);
    };

    if (codeTemplateGetQuery.isLoading || templateFilesQuery.isLoading) {
        return <div>加载中</div>
    }

    return (<div className={'w-full'}>
        <div className={'w-full'}>
            <div className={'flex flex-row gap-2 items-center'}>
                <div className={'font-bold text-lg'}>模版数据填充</div>
                <div>
                    {
                        codeTemplateGetQuery.data.data.data.ownerId !== 0 &&
                        <Button onClick={() => {
                            codeTemplateUpdate.mutate({
                                id: id,
                                transferFn: transferFn
                            })
                        }}
                                size={"small"}
                                variant={"contained"}>同步</Button>
                    }

                </div>
            </div>
            <div className={'flex flex-row gap-4 mt-2'}>
                <div>
                    <div className={'mb-2'}>转换函数</div>
                    <CodeMirror
                        height={"300px"}
                        theme={"dark"}
                        width={"48vw"}
                        value={codeTemplateGetQuery.data.data.data.transferFn}
                        extensions={[javascript(), autocompletion()]}
                        // className={"rounded-2xl w-4/5"}

                        onChange={e => setTransferFn(e)}
                    />
                </div>
                <div>
                    <div className={'mb-2'}>示例数据</div>
                    <CodeMirror
                        height={"300px"}
                        theme={"dark"}
                        width={"24vw"}
                        value={tableObj}
                        extensions={[json(), autocompletion()]}
                        // className={"rounded-2xl w-4/5"}

                    />
                </div>
            </div>
        </div>
        <div className={'mt-8'}>
            <div className={'flex flex-row items-center gap-2'}>

                <div className={'font-bold text-lg'}>文件模版</div>
            </div>

            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                        {
                            templateFilesQuery.data.data.data.map(
                                (it, index) => <Tab sx={{textTransform: 'none'}}
                                                    label={it.fileName} {...a11yProps(index)} />
                            )
                        }
                        <div className={'flex flex-row items-center'} onClick={handleClickOpen}>
                            <AddIcon color={'primary'} fontSize={'large'}/>
                        </div>
                    </Tabs>
                </Box>
                {
                    templateFilesQuery.data.data.data.map((file, index) => {
                        let func = eval(codeTemplateGetQuery.data.data.data.transferFn)
                        return <ZTabPanel value={tabValue} index={index}>
                            <div className={'flex flex-row gap-2'}>
                                {
                                    codeTemplateGetQuery.data.data.data.ownerId !== 0 &&
                                    <Button variant={"contained"} size={"small"} onClick={() => {
                                        codeTemplateFileUpdate.mutate({
                                            id: file.id,
                                            content: tableCode
                                        })
                                    }}>同步</Button>
                                }

                                <Button variant={"contained"} size={'small'} onClick={() => {
                                    setPreviewCode(mustache.render(file.content,
                                        func(JSON.parse(tableObj))))
                                    setCodePreviewOpen(true)
                                }}>预览</Button>
                            </div>
                            <div className={'mt-4 flex flex-row gap-4'}>
                                {
                                    file.fileName.endsWith(".xml") && <CodeMirror
                                        height={"500px"}
                                        theme={"dark"}
                                        width={"70vw"}
                                        value={file.content}
                                        extensions={[xml(), autocompletion()]}
                                        onChange={e => setTableCode(e)}
                                    />
                                }
                                {
                                    file.fileName.endsWith(".java") && <CodeMirror
                                        height={"500px"}
                                        theme={"dark"}
                                        width={"70vw"}
                                        value={file.content}
                                        extensions={[java(), autocompletion()]}
                                        onChange={e => setTableCode(e)}
                                    />
                                }
                                {
                                    file.fileName.endsWith(".js") && <CodeMirror
                                        height={"500px"}
                                        theme={"dark"}
                                        width={"70vw"}
                                        value={file.content}
                                        extensions={[javascript(), autocompletion()]}
                                        onChange={e => setTableCode(e)}
                                    />
                                }
                                {
                                    file.fileName.endsWith(".js") && <CodeMirror
                                        height={"500px"}
                                        theme={"dark"}
                                        width={"70vw"}
                                        value={file.content}
                                        extensions={[javascript(), autocompletion()]}
                                        onChange={e => setTableCode(e)}
                                    />
                                }


                            </div>
                        </ZTabPanel>
                    })
                }
                <TemporaryDrawer open={codePreviewOpen}
                                 handleClose={() => setCodePreviewOpen(false)}
                                 element={<CodeResult format={'javascript'} content={previewCode}/>}/>
            </Box>


            <Dialog open={templateEditDialogOpen} onClose={handleClose}>
                <DialogTitle>新增文件</DialogTitle>
                <DialogContent>
                    <TextField sx={{marginTop: '20px'}} label={"文件名称"} size={"small"} value={fileName}
                               onChange={(e) => {
                                   setFileName(e.target.value)
                               }}/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={() => {
                        templateFileAdd.mutate({
                            fileName: fileName,
                            templateId: id,
                        })
                        setTemplateEditDialogOpen(false)
                    }}>保存</Button>
                </DialogActions>
            </Dialog>
        </div>
    </div>)
}
