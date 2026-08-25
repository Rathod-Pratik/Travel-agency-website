export interface ICategory {
    name: string;
    slug: string;
    description?: string;
    icon: string;
    isHomePage: boolean;
    isDeleted: boolean;
    DeletedAt: Date | null;
}