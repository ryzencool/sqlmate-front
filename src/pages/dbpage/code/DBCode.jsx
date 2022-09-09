import React, {useState} from 'react'
import {activeTableAtom} from "../../../store/tableListStore";
import {Parser} from '@dbml/core'
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import mustache from "mustache/mustache.mjs";
import {CopyBlock, nord} from "react-code-blocks";
import {useGetDBML, useListCodeTemplate, useListTemplateFile} from "../../../store/rq/reactQueryStore";
import {useAtom} from "jotai";
import {a11yProps, ZTabPanel} from "../../../components/tab/ZTabPanel";


export default function DBCode() {

    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [value, setValue] = React.useState(0);

    const snake2Camel = (str) => {
        return str.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase())
    }

    const camel2Snake = (str) => {
        return str.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())
    }

    const firstUpperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 官方和自己的
    const codeTemplatesQuery = useListCodeTemplate({}, {
        onSuccess: data => {
            console.log("当前的选择", data.data.data)
            let res = data.data.data
            if (!!res && res.length > 0) {
                setSelectedTemplateSearch({
                    templateId: res[0].id
                })
            }

        }
    })

    const [selectedTemplateSearch, setSelectedTemplateSearch] = useState({})

    const templateFilesQuery = useListTemplateFile(selectedTemplateSearch)

    // const [dbmlObj, setDbmlObj] = useState(null)

    const dbmlQuery = useGetDBML({tableId: activeTable},
        {enabled: !!activeTable})

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    if (dbmlQuery.isLoading || codeTemplatesQuery.isLoading || templateFilesQuery.isLoading) {
        return <div>isLoading</div>
    }

    let dbmlObj;
    try {
        dbmlObj = Parser.parse(dbmlQuery.data.data.data, 'dbml')
    }catch (e) {
        return <div>无字段</div>
    }


    return (<div className={"w-full"}>
        <Box
            sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{borderRight: 1, borderColor: 'divider'}}
            >
                {
                    codeTemplatesQuery.data.data.data.map((tpl, index) => {
                        return <Tab label={tpl.name} {...a11yProps(index)} onClick={() => {
                            setSelectedTemplateSearch({
                                templateId: tpl.id
                            })
                        }
                        }/>
                    })
                }

            </Tabs>
            <div className={'flex flex-col gap-6 w-full'}>
                {
                    codeTemplatesQuery.data.data.data.map((tpl, index) => {
                        return <ZTabPanel value={value} index={index} key={tpl.id} className={'w-full'}>
                            <div className={'flex flex-col gap-6'}>
                                {
                                    templateFilesQuery.data.data.data.map(
                                        file => {
                                            let transfer = eval(tpl.transferFn)
                                            let content = file.content
                                            console.log("可以可以：", tpl.transferFn, content, dbmlObj)
                                            let newObj
                                            try {
                                                console.log("大家是：", dbmlObj.schemas[0].tables[0])
                                                newObj = transfer(dbmlObj.schemas[0].tables[0])
                                            } catch (e) {
                                                console.log("错误是", e)
                                                return
                                            }


                                            return (<div key={file.id} className={'w-full'}>
                                                    <div
                                                        className={'font-bold  border-b pb-1'}>{mustache.render(file.fileName, newObj)}</div>
                                                    <div className={'mt-4'}>
                                                        <CopyBlock
                                                            text={mustache.render(content, newObj)}
                                                            theme={nord}
                                                            language={"java"}
                                                            customStyle={
                                                                {
                                                                    padding: "20px",
                                                                    width: "100%",
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                                }
                            </div>
                        </ZTabPanel>
                    })
                }
            </div>


        </Box>

    </div>)
}
