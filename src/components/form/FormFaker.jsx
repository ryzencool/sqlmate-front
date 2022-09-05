import React, {useEffect, useState} from 'react'
import FormSelect from "./FormSelect";


const kinds = [
    {
        key: "address",
        value: "地址",
        cates: [
            {
                key: "buildingNumber",
                value: "建筑号(5786, 379)"
            },
            {
                key: "cardinalDirection",
                value: "朝向(North, South)"
            }, {
                key: "cityName",
                value: "城市(BeiKing, ShangHai)"
            }, {
                key: "country",
                value: "国家(China, America)"
            }, {
                key: "countryCode",
                value: "国家简拼(CH, GA)"
            }, {
                key: "county",
                value: "县(Borders, Cambridgeshire)"
            }, {
                key: "direction",
                value: "位置(Northeast, Southeast)"
            }, {
                key: "latitude",
                value: "纬度(8.7864, -30.9501)"
            }, {
                key: "longitude",
                value: "经度(17.5729,-154.0226)"
            }, {
                key: "nearbyGPSCoordinate",
                value: "GPS座标([\"8.7864\",\"33.4241\"], [ '33.8475', '-170.5953' ])"
            }


        ]
    }, {
        key: "animal",
        value: "动物",
        cates: [
            {
                key: "bear",
                value: "熊"
            }, {
                key: "bird",
                value: "鸟"
            }
        ]
    }
]


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
