export interface Shipping {
    idShipping: string
    idOrder: string
    created_at: string | Date
    update_at: string | Date
    status: string
    guide: string
    method: string
}

export interface ShippingCart {
    idShipping: string
    idOrder: string
    created_at: string | Date
    update_at: string | Date
    status: string
    guide: string
    method: string
    idCart: string
}

export interface ShippingProduct {
    idShipping: string
    idOrder: string
    created_at: string | Date
    update_at: string | Date
    status: string
    guide: string
    method: string
    title: string
    sources: string
}