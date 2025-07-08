export interface ServiceModel{
        service_id: number,
        name: string,
        description: string,
        price: number,
        service_type: string,
        duration_days: number,
        is_active: number
}

export interface ServiceResponse{
    services:[ServiceModel]
}