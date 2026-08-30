export interface ICoupan {
    id: string;
    code: string;
    name: string;
    description: string;
    discount: number;
    isActive: boolean;
    expiryDate: Date;
}