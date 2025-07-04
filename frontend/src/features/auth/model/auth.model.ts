export interface AuthModel{
    message:string,
    user:{
        user_id:number,
        username: string,
        user_status:string,
        role_id:number,
        profile_id:number,
        professional_id:string,
        role_name:string
    },
    token:string
};