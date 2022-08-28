import React, {useRef, useState} from "react";
import {Outlet, useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useAtom} from "jotai";
import {dbTypeAtom} from "../store/sqlStore";
import {exporter, Parser, importer} from "@dbml/core";
import ZMenu from "../components/ZMenu";
import {useLocation} from "react-router-dom";

function Header() {

    const location = useLocation()

    console.log("当前路径", location.pathname, location.hash, location.search)

    const [dbType, setDbType] = useAtom(dbTypeAtom)


    // const handleChange = (e) => {
    //     setDbType(e.target.value)
    // }
    //
    // const selectFile = () => {
    //     fileInput.current.click()
    // }
    //
    //
    // const fileInput  = useRef()
    //
    // const showFile = (e) => {
    //     e.preventDefault();
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const text = e.target.result;
    //         let dbml = importer.import(text.toString(), 'postgres')
    //         let sqlJson = exporter.export(dbml, 'json');
    //         console.log(sqlJson)
    //     };
    //     reader.readAsText(e.target.files[0]);
    // };


    const navigate = useNavigate()
    return (
        <div className="h-screen w-screen">
            <div className="h-20  flex-col flex w-full">
                <div className={"h-16  w-screen flex flex-row items-center border-b justify-between w-full"}>
                    <div className={'text-2xl font-bold text-xl pl-10 w-[300px]'} onClick={() => navigate("/index")}>
                        SQLMate
                    </div>
                    <div className={'flex flex-row  items-center justify-between'}>
                        <div>
                            {
                                location.pathname.includes("home") &&  <ZMenu/>
                            }

                            {/*<input type={'file'} style={{display: "none"}} ref={fileInput} onChange={showFile}/>*/}
                            {/*<Button>同步表</Button>*/}
                            {/*<Button onClick={() => selectFile()}>import</Button>*/}
                            {/*<Button>export</Button>*/}
                        </div>
                        <div className={"flex flex-row items-center pr-10  gap-2"}>
                            <Button>邀请伙伴</Button>
                            <Button size={"small"} variant={"contained"} onClick={() => navigate('/header/dashboard/myProject')}>控制台</Button>
                            <div>
                                zmyjust@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"h-[calc(100vh-5rem)]"}>
                <Outlet/>
            </div>
        </div>
    );
}

export default Header;
