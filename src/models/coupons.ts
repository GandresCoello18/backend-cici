export interface Coupons {
    idCoupon: string
    type: string
    descripcion: string
    status: string
}

export interface CouponsUser {
    id_user_coupons: string
    idUser: string | null
    idCoupon: string | null
    expiration_date: string | Date
    created_at: string | Date
    idGuestUser: string | null
    status: string
}

export interface MyCouponsUser {
    id_user_coupons: string
    expiration_date: string | Date
    created_at: string | Date
    type: string | null
    status: string
    userName: string | null
    avatar: string | null
}