export type ContentType =
    | "terms"
    | "privacy"
    | "about"
    | "help"
    | "contact"
    | "cookie-policy"
    | "travel-policy"
    | "payment-policy"
    | "booking-policy";


export interface IContent {
    requestId: string;
    title: string;
    slug: string;
    type: ContentType;
    content: string[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface CreateContentJobData {
    title: string;
    slug: string;
    type: ContentType;
    content: string;
    isActive?: boolean;
    requestId: string;
}


export interface UpdateContentJobData {
    id: string;
    title?: string;
    slug?: string;
    type?: ContentType;
    content?: string;
    isActive?: boolean;
    requestId: string;
}


export interface DeleteContentJobData {
    id: string;
    requestId: string;
}