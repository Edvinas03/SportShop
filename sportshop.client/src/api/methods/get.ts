import { fetchRequest, getHeaders, type ApiResponse } from "./utils";

export async function methodGet<T>(endpoint: string): Promise<ApiResponse<T> | undefined> {
    return await fetchRequest<T>(endpoint, getHeaders());
}