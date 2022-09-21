import React from 'react'
import CodeMirror from "@uiw/react-codemirror";
import {Controller} from 'react-hook-form'


export default function FormCodeMirror({control, name, extensions}) {


    return <Controller name={name}
                       control={control}
                       render={({field: {onChange, value}}) => (
                           <CodeMirror height={"300px"}
                                       width={'550px'}
                                       theme={"dark"}
                                       value={value}
                                       onChange={onChange}
                                       extensions={extensions}
                                       className={"rounded-2xl"}/>
                       )}/>

}
