// src/types/index.ts

// Generic API Response
export interface ApiResponse<T> {
    data: T;
    message: string;
}

// Authorization Response
export interface AuthorizationResponse {
    token: string;
    refresh_token: string;
}

// User Profile
export interface UserProfileResponse {
    id: string;
    photo: string;
    name: string;
    mobile: string;
    gender: number;
    birthday: string;
    intro: string | null;
}

// Login Form Values
export interface LoginFormValues {
    mobile: string;
    code: string;
}

// Article Cover
export interface ArticleCover {
    type: number;
    images: string[];
}

// Article
export interface Article {
    id: string;
    title: string;
    status: number;
    comment_count: number;
    pubdate: string;
    cover: ArticleCover;
    like_count: number;
    read_count: number;
}

// Articles Response with Pagination
export interface ArticlesResponse {
    page: number | null;
    per_page: number | null;
    results: Article[];
    total_count: number;
}

// Publish Form Values
export interface PublishFormValues {
    title: string;
    channel_id: number;
    content: string;
}

// Channel Interface
export interface ChannelType {
    id: number;
    name: string;
}

export interface ChannelsResponse {
    channels: ChannelType[];
}
export interface PublishResponse {
    article: Article; // Adjust according to your API's response
    // Add other relevant fields if necessary
}