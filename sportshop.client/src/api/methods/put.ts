import { methodPost } from "./post";
import { ApiResponse } from "./utils";

export async function methodPut<T>(endpoint: string, data: Record<string, any>): Promise<ApiResponse<T> | undefined> {
    return await methodPost<T>(endpoint, data, 'PUT');
}