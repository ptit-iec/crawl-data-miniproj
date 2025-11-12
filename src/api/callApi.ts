import axios, { AxiosRequestConfig, Method, ResponseType, AxiosError } from 'axios';
import { Dispatch, Action } from '@reduxjs/toolkit';

interface CallApiParams<TRequest = unknown> {
    method: Method;
    apiPath: string;
    actionTypes: [
        (payload?: unknown) => Action, // request
        (payload?: any) => Action, // success
        (payload?: unknown) => Action  // failure
    ];
    variables?: TRequest;
    dispatch: Dispatch;
    getState?: () => unknown;
    headers?: Record<string, string>;
    goToErrorPageWhenFail?: boolean;
    originalPayload?: unknown;
    responseType?: ResponseType;
}

export default async function callApi<TRequest = unknown, TResponse = unknown>({
    method,
    apiPath,
    actionTypes: [requestType, successType, failureType],
    variables,
    dispatch,
    headers,
    goToErrorPageWhenFail = true,   
    originalPayload = {},
    responseType = 'json',
}: CallApiParams<TRequest>): Promise<TResponse | void> {
    const baseUrlApi = process.env.NEXT_PUBLIC_API_URL;
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('techNewsToken');
    }

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config: AxiosRequestConfig = {
        method,
        url: `${baseUrlApi}${apiPath}`,
        headers: headers ? { ...defaultHeaders, ...headers } : defaultHeaders,
        responseType,
    };

    if (variables) {
        if (method === 'GET') config.params = variables;
        else config.data = variables;
    }

    dispatch(requestType(originalPayload));

    try {
        const response = await axios<TResponse>(config);
        dispatch(successType(response.data));
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        const response = error.response ?? error;
        console.log(response);
        // vẫn giữ nguyên logic cũ, chỉ fix type
        // if (response.status === 401) {
        //     message.error(`Unauthorized`);
        // } else if (response.status === 403 || response.status === 404) {
        //     if (goToErrorPageWhenFail) {
        //         // TODO: redirect error page
        //     }
        //     message.error(`API Error: ${response.data?.message}`);
        //     dispatch(failureType(error.response?.message));
        // } else {
        //     dispatch(failureType(error.response?.message));
        // }

        // return response;
    }
}
