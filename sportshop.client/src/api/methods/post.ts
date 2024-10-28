import { getCookie } from "@/utils/cookie";
import { fetchRequest, getHeaders, type ApiResponse } from "./utils";

export async function methodPost<T>(
    endpoint: string,
    data: Record<string, any>,
    methodType: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
): Promise<ApiResponse<T>> {
    const csrfToken = getCookie("XSRF-TOKEN");
    const options: RequestInit = {
        ...getHeaders({ "x-xsrf-token": csrfToken }),
        method: methodType,
        body: JSON.stringify(data)
    };

    return await fetchRequest<T>(endpoint, options);
}