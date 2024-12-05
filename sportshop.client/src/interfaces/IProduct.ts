import { IImage } from "./IImage";
export interface IProduct {
    id: number
    title: string
    category: string;
    gender: string;
    description: string
    price: number
    rating: number
    size1: string
    size2: string
    size3: string
    image: IImage
    createdAt: string
    updatedAt: string
}