export interface RegisterResponse{
    message:string,
    user: {
        profile_id:number,
        user_id:number,
        first_name:string,
        last_name:string,
        email:string,
        birth_date:string,
        gender:string
    };
}