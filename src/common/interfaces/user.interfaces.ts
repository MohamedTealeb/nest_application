export interface IUser {
username:string;
email:string,
password:string
id:number,
ConfirmPassword:string
// Google OAuth fields
googleId?:string;
// Password reset fields
resetPasswordOtp?:string;
resetPasswordAt?:Date;
}
