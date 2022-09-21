import React from 'react'
import {Outlet} from "react-router";


export default function SignUpIn(props) {


    return <div className={'grid grid-cols-2 w-screen'}>
        <div className={'col-span-1 h-screen bg-orange-200'}>
            <img className={'w-full h-full object-cover'}
                src={'https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/pexels-pixabay-52500.jpg'}/>
        </div>
        <div className={'col-span-1 h-screen flex flex-col justify-center items-center'}>
            <Outlet/>
        </div>
    </div>
}
