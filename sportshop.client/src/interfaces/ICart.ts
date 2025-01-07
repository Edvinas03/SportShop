export interface ICart {
    id: number;
    productId: number;
    title: string;
    imagePath: string;
    quantity: number;
    price: number;
    userId: string;
    isBought: boolean;
    IsCanceled: string;
    IsDelivered: string;
    createdAt: string;
    updatedAt: string;
}