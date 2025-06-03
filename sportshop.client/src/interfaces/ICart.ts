export interface ICart {
    id: number;
    productId: number;
    title: string;
    imagePath: string;
    quantity: number;
    price: number;
    userId: string;
    size?: string;
    size1?: string;
    size2?: string;
    size3?: string;
    isBought: boolean;
    IsCanceled: string;
    IsDelivered: string;
    createdAt: string;
    updatedAt: string;
}