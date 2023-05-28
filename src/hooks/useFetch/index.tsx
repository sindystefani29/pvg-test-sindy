"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createApi } from "unsplash-js";
import { ApiResponse } from "unsplash-js/dist/helpers/response"

import deepCompare from "@/route/helpers/deepCompare";
import { FetcherType, FetchStatus, OptionTypes, UnsplashResponseType } from "./types"

const api = (accessKey: string) => createApi({ accessKey });

const DEFAULT_FETCH_STATE = {
    status: FetchStatus.Init,
    code: 0,
    data: {}
}

type fetcherFuncType = (options: OptionTypes) => Promise<FetcherType>
type fetchMethodFuncType = (action: OptionTypes) => Promise<UnsplashResponseType>

const fetcher: fetcherFuncType = async ({ variables, onError, accessKey }) => {
    let res

    try {
        res = await api(accessKey).search.getPhotos(variables)
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

const fetchMethod: fetchMethodFuncType = async (options: OptionTypes) => {
    let response: FetcherType = {
        isSuccessful: false,
        statusCode: 0
    }

    response = await fetcher(options)

    return {
        status: response.isSuccessful ? FetchStatus.Success : FetchStatus.Error,
        code: response.statusCode,
        data: response.jsonData || {}
    }
}

export default function useFetch(options: OptionTypes): [UnsplashResponseType, () => Promise<void>] {
    const variables = options.variables

    const cachedVariables = useRef<Partial<OptionTypes['variables']>>({})
    const [data, setData] = useState(DEFAULT_FETCH_STATE)

    const doFetch = useCallback(async () => {
        setData({
            ...DEFAULT_FETCH_STATE,
            status: FetchStatus.Loading
        })

        const tmp = await fetchMethod(options)

        setData(tmp)
    }, [options])

    useEffect(() => {
        const isSameValues = deepCompare(cachedVariables.current, variables)
        if (!isSameValues) {
            cachedVariables.current = variables
            doFetch()
        }
    }, [variables.query, variables.page, cachedVariables.current])

    return [data, doFetch]
}