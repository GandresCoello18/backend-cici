export interface Category {
    idCategory?: number;
    titleCategory: string;
}

export interface CategoryProduct {
    id_product_category: number;
    idCategory: string;
    idProduct: string;
}