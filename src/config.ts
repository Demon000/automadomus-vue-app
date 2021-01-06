export const CONFIG_API_BASE_URL: string = process.env
    .VUE_APP_API_BASE_URL as string;
export const CONFIG_SOCKET_BASE_URL: string = process.env
    .VUE_APP_SOCKET_BASE_URL as string;
export const CONFIG_AREAS_PAGINATED_LIMIT: number = parseInt(
    process.env.VUE_APP_AREAS_PAGINATED_LIMIT,
);
