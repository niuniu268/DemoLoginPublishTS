// src/apis/article.ts

import { http } from '../utils';
import { ChannelType, PublishResponse } from '../types';
import {
    ChannelsResponse,
    Article,
    ArticlesResponse,
    PublishFormValues
} from '../types';
import { AxiosResponse } from 'axios';
import {message} from "antd";

/**
 * Fetches all channels.
 */
export async function getChannelAPI(): Promise<ChannelType[]> {

    try {
        const  res = await http.get<ChannelsResponse>('/channels');

        console.log(res.data);
        if (!res.data || !Array.isArray(res.data.channels)) {
            throw new Error('Invalid response format');
        }

        return res.data.channels
    }catch (error) {
        console.error('API Error:', error);
        message.error('获取频道列表失败');

        return [];

    }

}

/**
 * Fetches an article by its ID.
 * @param id - The ID of the article.
 */
export function getArticleById(id: string): Promise<AxiosResponse<Article>> {
    return http.get<Article>(`/mp/articles/${id}`);
}

/**
 * Fetches a list of articles based on provided parameters.
 * @param params - The query parameters for fetching articles.
 */
interface ArticleListParams {
    status?: number;
    channel_id?: number;
    begin_pubdate?: string;
    end_pubdate?: string;
    page?: number;
    per_page?: number;
}

export async function getArticleListAPI(params: ArticleListParams): Promise<ArticlesResponse> {

    try {
        const  res = await http.get<ArticlesResponse>('/mp/articles', { params });
        if (!res || !res.data) {
            throw new Error('Invalid API response');
        }

        return res.data
    }catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export function publishArticleAPI(data: PublishFormValues): Promise<PublishResponse> {
    return http.post<PublishResponse>('/mp/articles', data).then(res => res.data);

}
