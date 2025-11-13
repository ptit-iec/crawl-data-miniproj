const ACCESS_TOKEN_KEY = 'techNewsToken';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
};