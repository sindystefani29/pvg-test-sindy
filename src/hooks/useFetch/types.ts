import { SearchParams } from "unsplash-js/dist/methods/search"
import { Photos } from "unsplash-js/dist/methods/search/types/response"

export enum FetchStatus {
    Error,
    Loading,
    Success,
    Init
}

export interface UnsplashResponseType {
    status: FetchStatus,
    data: Partial<Photos>,
    code: number
}

export interface OptionTypes {
    accessKey: string
    variables: SearchParams,
    onError: () => void
}

export interface FetcherType {
    jsonData?: Photos,
    isSuccessful: boolean,
    statusCode: number
}