export type Error = {
    error: string
}

export type EmailError = {
    statusCode: string | number
    message: string
}
export type EmailErrors<T> = {
    data: T[]
    errors: EmailError[]
}

export type Data<T, PE> = T | PE | PE[] | null | Error
