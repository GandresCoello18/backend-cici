export interface Product {
    idProducts: string;
    title: string;
    source: string;
    price: number;
    status: string;
    description: string;
    available: number;
    sold: number;
    stars: number;
    brand: string;
    size: string;
    model: string;
    related_sources: SourcesProduct[];
    created_at: Date | string;
    discount: number;
    starsPeople: number;
}

export interface SourcesProduct {
    idSourceProduct: string;
    source: string;
    kind: string,
    idProduct: string;
}

export interface ProductReviews {
    idProductReviews: string
    commentary: string
    stars: number
    created_at: Date | string
    idUser: string
    idProduct: string
}

export interface ProductReviewByUser {
    idProductReviews: string
    commentary: string
    stars: number
    created_at: Date | string
    userName: string
    avatar: string
}