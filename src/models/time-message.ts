export interface TimeMessage {
    id_time_message: string
    destination: string
    subject: string
    created_at: string | Date
    life_minutes: number
    status?: string
}