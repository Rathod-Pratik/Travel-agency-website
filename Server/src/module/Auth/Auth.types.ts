export interface IAuth{
    image:string,
    name:string,
    email:string,
    password:string,
    phone:string,
    role:string,
    address:string,
    isDeleted:boolean,
    DeletedAt:Date
}

export interface ILogin{
email:string,
password:string
}