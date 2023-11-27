import { NLists, NPhotos, NPayload } from 'ts-foursquare/types'
import ITip = NLists.ITip

export type IPayload<T> = NPayload.IPayload<T>

export interface IPhotosResponse {
    photos: {
        count: number
        items: IPhoto[]
    }
}
export interface IPhoto extends NPhotos.IPhoto {
    tip?: ITip
}
