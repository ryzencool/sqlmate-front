import {useQuery} from "@tanstack/react-query";
import {
    connectIsLive,
    dbmlTable,
    generateTeamJoin,
    getCodeTemplate,
    getConsole,
    getProject,
    getProjectDetail,
    getTable,
    getTemplateFile,
    getUserInfo,
    listCodeTemplate,
    listDefaultColumns,
    listDefaultColumnTemplate,
    listFavoriteProject,
    listMyProject,
    listProject,
    listProjectSnapshots,
    listProjectSql,
    listTableColumns,
    listTableIndexes,
    listTableRel,
    listTables,
    listTablesDetail,
    listTeam,
    listTeamUser,
    listTemplateFile,
    pagePublicProject,
    queryOptimizer,
    queryProjectDBML
} from "../../api/dbApi";

export const useGetUserInfo = (params, options = {}) => {
    return useQuery(['userInfo', params], () => getUserInfo(params), options)
}

export const useGetProject = (params, options) => useQuery(['project', params],
    () => getProject(params), options)

export const useGetProjectDetail = (params, options) => useQuery(['projectDetail', params],
    () => getProjectDetail(params), options)


export const useListColumn = (search, options = {}) => {
    return useQuery(["tableColumns", search], () => listTableColumns(search), options)
}

export const useListIndex = (search, options = {}) => {
    return useQuery(['tableIndexes', search], () => listTableIndexes(search), options)
}

export const useGetCodeTemplate = (params = {}, options = {}) => {
    return useQuery(['codeTemplate', params], () => getCodeTemplate(params), options);
}

export const useListProjectSql = (params = {}, options = {}) => {
    return useQuery(['projectSqls', params], () => listProjectSql(params), options)
}

export const useListTables = (search, options = {}) => {
    return useQuery(["projectTables", search], () => listTables(search), {
        enabled: !!search
    })
}

export const useListTablesDetail = (search, options = {}) => {
    return useQuery(['projectTablesDetail', search], () => listTablesDetail(search), options)
}

export const useListTableDetail = (search, options = {}) => {
    return useQuery(['projectTablesDetail', search], () => listTablesDetail(search), options)
}


export const useQueryOptimizer = (params = {}, options = {}) => {
    return useQuery(["queryOptimizer"], () => queryOptimizer(params), options)
}


export const useListCodeTemplate = (params = {}, options = {}) => {
    return useQuery(['codeTemplates'], () => listCodeTemplate(params), options)
}

export const useListTemplateFile = (params, options = {}) => {
    return useQuery(['templateFiles', params], () => listTemplateFile(params), options)
}


export const useGetTemplateFile = (params, options = {}) => {
    return useQuery(['templateFile', params], () => getTemplateFile(params), options)
}

export const usePagePublicProject = (params = {}, options = {}) => {
    console.log("???????????????")
    return useQuery(["publicProjects"], () => pagePublicProject(params), options)
}

export const useGetTable = (search, options = {}) => {
    return useQuery(['table', search], () => getTable(search), options)
}


export const useListTeam = (params = {}, options = {}) => {
    return useQuery(['teams'], () => listTeam(params), options)
}

export const useListTeamUser = (search, options = {}) => {
    return useQuery(['teamUsers', search], () => listTeamUser(search), options)
}


export const useGetDBML = (search, options = {}) => {
    return useQuery(['dbml', search], () => dbmlTable(search), options)
}


export const useListFavoriteProject = (search, options = {}) => {
    return useQuery(['favoriteProjects', search], () => listFavoriteProject(search), options)
}

export const useListProject = (search, options = {}) => {
    return useQuery(['projects', search], () => listProject(search), options)
}

export const useListMyProject = (search, options = {}) => {
    return useQuery(['myProjects', search], () => listMyProject(search), options)
}


export const useListSnapshot = (search, options = {}) => {
    return useQuery(['projectSnapshots', search], () => listProjectSnapshots(search), options)
}

export const useProjectDBML = (search, options = {}) => {
    return useQuery(['projectDBML', search], () => queryProjectDBML(search), options)
}


export const useListTableRel = (search, options = {}) => {
    return useQuery(['tableRels', search], () => listTableRel(search), options)
}

export const useListDefaultColumnTemplate = (search, options = {}) => {
    return useQuery(['defaultColumnTemplates', search], () => listDefaultColumnTemplate(search), options)
}


export const useListDefaultColumn = (search, options = {}) => {
    return useQuery(['defaultColumns', search], () => listDefaultColumns(search), options)
}


export const useGetConsole = (search, options = {}) => {
    return useQuery(['projectConsole', search], () => getConsole(search), options)
}


export const useGenerateTeamJoin = (search, options = {}) => {
    return useQuery(['teamJoinUrl', search], () => generateTeamJoin(search), options)
}


export const useConnectIsLive = (search, options = {}) => {
    return useQuery(['connectIsLive', search], () => connectIsLive(search), options)
}
