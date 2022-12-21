import { NLists, NPhotos } from 'ts-foursquare/types'
import ITip = NLists.ITip

export interface IPhotosResponse {
    photos: {
        count: number
        items: IPhoto[]
    }
}
export interface IPhoto extends NPhotos.IPhoto {
    tip?: ITip
}
