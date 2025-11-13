import axios, { AxiosRequestConfig, Method, ResponseType, AxiosError } from 'axios';
import { Dispatch, Action } from '@reduxjs/toolkit';
import { getAccessToken } from '@/lib/localStorage';
interface CallApiParams<TRequest = unknown> {
    method: Method;
    apiPath: string;
    actionTypes: [
        (payload?: unknown) => Action, // request
        (payload?: unknown) => Action, // success
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
    const token = getAccessToken();

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
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem('techNewsToken');
            localStorage.removeItem('techNewsUser');
            if (typeof window !== 'undefined') {
            window.location.href = '/thongtinkhcn/auth/login';
            }

            console.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        } 
        else if (status === 403) {
            console.error("Bạn không có quyền truy cập tài nguyên này.");
        } 

        dispatch(failureType(error.response?.data ?? error.message));
    }
}
