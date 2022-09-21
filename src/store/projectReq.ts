import {useQuery} from "@tanstack/react-query";
import {getProject, getProjectDetail} from "../api/dbApi";

export const KEY_PROJECT_INFO = 'project'

export const useGetProject = (params, options) => useQuery([KEY_PROJECT_INFO, params],
    () => getProject(params), options)

export const KEY_PROJECT_DETAIL = 'projectDetail'

export const useGetProjectDetail = (params, options) => useQuery([KEY_PROJECT_DETAIL, params],
    () => getProjectDetail(params), options)
