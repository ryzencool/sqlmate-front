import React, {useState} from 'react'
import {Card, Chip} from "@mui/material";
import {useListFavoriteProject} from "../../../store/rq/reactQueryStore";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {useAtom} from "jotai";
import ProjectCard from "./ProjectCard";

export default function FavoriteProject() {

    const navigate = useNavigate()

    const [project, setProject] = useAtom(activeProjectAtom)
    const [favoriteProjectSearch, setFavoriteProjectSearch] = useState({})
    const favoriteProjects = useListFavoriteProject(favoriteProjectSearch)

    const handleClickEnterProject = (data) => {
        navigate(`/console/project/${data.id}`);
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
                        // @ts-expect-error TS(2741) FIXME: Property 'mode' is missing in type '{ project: any... Remove this comment to see the full error message
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

