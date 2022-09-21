import {useQuery} from "@tanstack/react-query";
import {listTableColumns, listTableIndexes, listTables, listTablesDetail} from "../api/dbApi";

export const KEY_TABLE_COLUMNS = "tableColumns"

export const useListColumn = (search, options = {}) => {
    return useQuery([KEY_TABLE_COLUMNS, search], () => listTableColumns(search), options)
}

export const KEY_TABLE_INDEXES = "tableIndexes"

export const useListIndex = (search, options = {}) => {
    return useQuery([KEY_TABLE_INDEXES, search], () => listTableIndexes(search), options)
}

export const KEY_PROJECT_TABLES = "projectTables"

export const useListTables = (search, options = {}) => {
    return useQuery([KEY_PROJECT_TABLES, search], () => listTables(search), {
        enabled: !!search
    })
}


export const KEY_PROJECT_TABLES_DETAIL = "projectTablesDetail"

export const useListTablesDetail = (search, options = {}) => {
    return useQuery(['projectTablesDetail', search], () => listTablesDetail(search), options)
}
