export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
        Tables: {
            api_keys: {
                Row: {
                    description: string | null
                    redirect_url: string | null
                    created_at: string | null
                    updated_at: string | null
                    deleted_at: string | null
                    id: string
                }
                Insert: {
                    description?: string | null
                    redirect_url?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    id: string
                }
                Update: {
                    description?: string | null
                    redirect_url?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    id?: string
                }
            }
            things: {
                Row: {
                    image_url: string | null
                    external_url: string | null
                    title: string | null
                    description: string | null
                    content_date: string | null
                    created_at: string | null
                    updated_at: string | null
                    deleted_at: string | null
                    external_id: string | null
                    type: string | null
                    external_source: string | null
                    id: string
                }
                Insert: {
                    image_url?: string | null
                    external_url?: string | null
                    title?: string | null
                    description?: string | null
                    content_date?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    external_id?: string | null
                    type?: string | null
                    external_source?: string | null
                    id: string
                }
                Update: {
                    image_url?: string | null
                    external_url?: string | null
                    title?: string | null
                    description?: string | null
                    content_date?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    external_id?: string | null
                    type?: string | null
                    external_source?: string | null
                    id?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
