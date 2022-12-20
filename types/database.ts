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
                    updated_at: string | null
                    deleted_at: string | null
                    id: string
                    created_at: string | null
                }
                Insert: {
                    description?: string | null
                    redirect_url?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    id?: string
                    created_at?: string | null
                }
                Update: {
                    description?: string | null
                    redirect_url?: string | null
                    updated_at?: string | null
                    deleted_at?: string | null
                    id?: string
                    created_at?: string | null
                }
            }
            things: {
                Row: {
                    image_url: string | null
                    external_url: string | null
                    title: string | null
                    description: string | null
                    content_date: string | null
                    deleted_at: string | null
                    external_id: string | null
                    type: string
                    external_source: string
                    id: string
                    created_at: string
                    updated_at: string
                    posted_at: string | null
                }
                Insert: {
                    image_url?: string | null
                    external_url?: string | null
                    title?: string | null
                    description?: string | null
                    content_date?: string | null
                    deleted_at?: string | null
                    external_id?: string | null
                    type: string
                    external_source: string
                    id?: string
                    created_at?: string
                    updated_at?: string
                    posted_at?: string | null
                }
                Update: {
                    image_url?: string | null
                    external_url?: string | null
                    title?: string | null
                    description?: string | null
                    content_date?: string | null
                    deleted_at?: string | null
                    external_id?: string | null
                    type?: string
                    external_source?: string
                    id?: string
                    created_at?: string
                    updated_at?: string
                    posted_at?: string | null
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
