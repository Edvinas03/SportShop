export type ApiResponse<T> = T & { error?: string };

export function getFullUrl(endpoint: string): string {
    return `/api/${endpoint}`;
}

export function getHeaders(additionalHeaders = {}): Record<string, any> {
    return {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            ...additionalHeaders,
        },
        credentials: 'include' // Include credentials for all requests
    };
}

export async function fetchRequest<T>(
    endpoint: string,
    options: RequestInit
): Promise<ApiResponse<T>> {
    const fullUrl = getFullUrl(endpoint);

    try {
        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 400 || response.status === 403) {
                alert('Neteisinga duomenų validacija');
            }
            return { error: errorText } as ApiResponse<T>;
        }

        if (response.headers.get('content-length') === '0' || response.status === 204) {
            return {} as ApiResponse<T>; // Handle empty or no content response
        }

        return await response.json() as ApiResponse<T>;
    } catch (error: any) {
        alert(error.message);
        console.error(error);
        return { error: error.message || 'Request failed' } as ApiResponse<T>;
    }
}