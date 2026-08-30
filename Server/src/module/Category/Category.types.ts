export interface ICategory {
    requestId: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isHomePage?: boolean;
    isDeleted?: boolean;
    DeletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCategoryJobData {
    requestId: string;
    categoryData: {
        name: string;
        slug: string;
        description?: string;
        icon?: string;
        isHomePage?: boolean;
    };
}

export interface UpdateCategoryJobData {
    requestId: string;
    id: string;
    categoryData: {
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        isHomePage?: boolean;
    };
}

export interface DeleteCategoryJobData {
    requestId: string;
    id: string;
}