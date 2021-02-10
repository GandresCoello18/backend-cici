export interface Orden {
    idOrder: string
    idCart: string
    idUser: string
    created_at: string | Date
    update_at: string | Date
    status: string
    paymentMethod: string | null
    shipping: number
    discount: string
    totalAmount: number
    id_user_coupons: string | null
    paymentId: string | null
}