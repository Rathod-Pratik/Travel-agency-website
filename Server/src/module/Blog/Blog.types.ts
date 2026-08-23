export interface IBlog{
    title:string,
    image:string,
    description:string[],
    isDeleted?:boolean,
    DeletedAt?:Date
}