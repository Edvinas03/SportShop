export interface ICart {
    id?: number;
    productId: number;
    title: string;
    quantity: number;
    price: number;
    userId: string;
    isBought: boolean;
    canceledAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    imagePath?: string;
}