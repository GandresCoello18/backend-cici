export interface Category {
    idCategory: number;
    titleCategory: string;
}

export interface CategoryProduct {
    id_product_category: number;
    idCategory: string;
    idProduct: string;
}

export interface ResProductCategory {
    id_product_category: number;
    titleCategory: string;
}