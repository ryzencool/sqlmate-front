import React from 'react'
import {usePagePublicProject} from "../../../store/rq/reactQueryStore";
import {useNavigate} from "react-router";
import Button from "@mui/material/Button";
import {useAtom} from "jotai";
import {activeProjectAtom} from "../../../store/jt/projectStore";
import {addFavoriteProject} from "../../../api/dbApi";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import toast from "react-hot-toast";


export default function PublicProject() {

    const publicProjects = usePagePublicProject()


    const [project, setProject] = useAtom(activeProjectAtom)
    const navigate = useNavigate()

    const handleClickEnterProject = (it) => {
        setProject(it)
        navigate(`/console/project/${it.id}`)
    }

    const queryClient = useQueryClient()

    const addFavoriteProjectMutation = useMutation(addFavoriteProject, {
        onSuccess: data => {
            queryClient.invalidateQueries(['favoriteProjects'])
        }
    })

    const handleClickCollectProject = (data) => {

        addFavoriteProjectMutation.mutate({
            projectId: data.id
        }, {
            onSuccess: (data) => {
                toast("收藏成功")
            }
        })
    }

    if (publicProjects.isLoading) {
        return <div>加载中</div>
    }
    return <div>
        <div className={" flex flex-row flex-wrap gap-10 mb-10"}>
            {
                publicProjects.data.data.data.dataList.map(
                    it => (
                        <ProjectCard project={it} mode={"public"} operateArea={
                            <div>
                                <Button onClick={() => handleClickCollectProject(it)}>收藏</Button>
                                <Button onClick={() => handleClickEnterProject(it)}>进入项目</Button>
                            </div>}/>
                    )
                )
            }
        </div>
    </div>
}
