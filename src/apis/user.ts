// src/apis/user.ts

import { http } from '../utils/request';
import { LoginFormValues, AuthorizationResponse } from '../types';

/**
 * Logs in a user.
 * @param data - The login form values.
 * @returns A promise that resolves to AuthorizationResponse.
 */
export async function loginAPI(data: LoginFormValues): Promise<AuthorizationResponse> {
    try {
        const res = await http.post<AuthorizationResponse>('/authorization', data);

        if (!res || !res.data) {
            throw new Error('Invalid API response');
        }

        return res.data; // Extract and return 'data'
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Re-throw to handle in the component or thunk
    }
}
