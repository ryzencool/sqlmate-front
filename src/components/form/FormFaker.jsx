import React, {useEffect, useState} from 'react'
import FormSelect from "./FormSelect";
import {kinds} from "./fakerStruct";


export default function FormFaker({control, nameKind, nameCate, watch, getValues}) {

    let kindTable = kinds.map(it => ({
        key: it.key,
        value: it.value
    }));

    const [cateTable, setCateTable] = useState([])


    React.useEffect(() => {
        const subscription = watch((value) => {
            let kind = kinds.find(ele => ele.key === value.kindKey)
            if (!!kind) {
                setCateTable(kind.cates)
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // 不知道原来的信息
    useEffect(() => {
        let kind = kinds.find(ele => ele.key === getValues().kindKey)
        if (!!kind) {
            setCateTable(kind.cates)
        }
    }, []);


    return <>
        <FormSelect name={nameKind} label={"业务数据类别"} control={control}
                    choices={kindTable}/>
        <FormSelect name={nameCate} label={"业务数据详情"} control={control}
                    choices={cateTable}/>
    </>

}
