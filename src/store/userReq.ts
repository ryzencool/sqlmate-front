import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "../api/dbApi";


export const KEY_USER_INFO = 'userinfo';

export const useGetUserInfo = (params, options = {}) => {
    return useQuery([KEY_USER_INFO, params], () => getUserInfo(params), options)
}
