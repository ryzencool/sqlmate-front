import React, {useState} from 'react'
import {Card, Chip} from "@mui/material";
import {useListFavoriteProject} from "../store/rq/reactQueryStore";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {activeProjectAtom} from "../store/projectStore";
import {useAtom} from "jotai";

export default function FavoriteProject() {

    const navigate = useNavigate()

    const [project, setProject] = useAtom(activeProjectAtom)
    const [favoriteProjectSearch, setFavoriteProjectSearch] = useState({})
    const favoriteProjects = useListFavoriteProject(favoriteProjectSearch)

    const handleClickEnterProject = (data) => {
        navigate(`/header/home/${data.id}`);
        setProject(data)
    }

    if (favoriteProjects.isLoading) {
        return <div>加载中</div>
    }

    console.log("结构是", favoriteProjects.data.data.data)

    return (<div>

        <div className={"flex flex-row gap-10"}>
            {
                favoriteProjects.data.data.data.map(
                    it =>
                        <Card className={"w-52 h-80 flex flex-col justify-between"} key={it.id}>
                            <div className={"h-1/2 bg-purple-300"}>
                                <img className={'w-full h-full object-cover'}
                                     src={"https://sqlmate-1259183164.cos.ap-shanghai.myqcloud.com/%E5%8D%A1%E7%89%87%E8%83%8C%E6%99%AF/pexels-pixabay-326012.jpg"}/>
                            </div>
                            <div className={"pl-2 pt-2 pb-1 flex-col flex "}>
                                <div className={" font-bold "}>
                                    {it.name}
                                </div>
                                <div className={'text-sm text-slate-400'}>
                                    {it.note}
                                </div>
                                <div className={'mt-2 flex flex-row flex-wrap gap-1 '}>
                                    {
                                        !!it.tags && it.tags.map(tag => (
                                            <Chip label={tag} size={'small'}/>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={'mt-2 w-full flex-row flex justify-end'}>
                                <Button onClick={() => handleClickEnterProject(it)}>进入项目</Button>
                            </div>
                        </Card>
                )
            }

        </div>
    </div>)
}

