"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ApiResponse } from "unsplash-js/dist/helpers/response"
import api from "@/route/api"
import { FetcherType, FetchStatus, OptionTypes, ReducerActionType, UnsplashResponseType } from "./types"

const DEFAULT_FETCH_STATE = {
    status: FetchStatus.Init,
    code: 0,
    data: {}
}

type fetcherFuncType = (variables: OptionTypes['variables'], onError: OptionTypes['onError']) => Promise<FetcherType>

const fetcher: fetcherFuncType = async (variables, onError) => {
    let res

    try {
        res = await api.search.getPhotos(variables)
    } catch (err) {
        onError()
        console.error(err)
    }

    const responseApi = res as ApiResponse<FetcherType['jsonData']> || {}
    const isError = Array.isArray(responseApi.errors) && responseApi.errors.length

    if (isError) {
        onError()
    }

    return {
        jsonData: responseApi.response,
        isSuccessful: Boolean(isError),
        statusCode: responseApi.status
    }
}

const fetchMethod: (action: ReducerActionType) => Promise<UnsplashResponseType> = async (action: ReducerActionType) => {
    let response: FetcherType = {
        isSuccessful: false,
        statusCode: 0
    }

    response = await fetcher(action.variables, action.onError)

    return {
        status: response.isSuccessful ? FetchStatus.Success : FetchStatus.Error,
        code: response.statusCode,
        data: response.jsonData || {}
    }
}

export default function useFetch(options: OptionTypes): [UnsplashResponseType, () => Promise<void>] {
    const variables = options.variables

    const cachedQuery = useRef('')
    const [data, setData] = useState(DEFAULT_FETCH_STATE)

    const doFetch = useCallback(async () => {
        setData({
            ...DEFAULT_FETCH_STATE,
            status: FetchStatus.Loading
        })

        const tmp = await fetchMethod({ type: options.method, variables, onError: options.onError })

        setData(tmp)
    }, [variables, options])

    useEffect(() => {
        if (cachedQuery.current !== variables.query) {
            cachedQuery.current = variables.query
            doFetch()
        }
    }, [variables.query, cachedQuery.current])

    return [data, doFetch]
}