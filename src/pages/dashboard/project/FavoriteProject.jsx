import React, {useState} from 'react'
import {Card, Chip} from "@mui/material";
import {useListFavoriteProject} from "../../../store/rq/reactQueryStore";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {activeProjectAtom} from "../../../store/projectStore";
import {useAtom} from "jotai";
import ProjectCard from "./ProjectCard";

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
                        <ProjectCard project={it} operateArea={
                            <div>
                                <Button onClick={() => handleClickEnterProject(it)}>进入项目</Button>
                            </div>
                        }/>

                )
            }

        </div>
    </div>)
}

