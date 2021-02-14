export interface Shipping {
    idShipping: string
    idOrder: string
    created_at: string | Date
    status: string
    guide: number
    method: string
}