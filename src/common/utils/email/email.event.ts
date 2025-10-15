import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "../email/send.email";
import { verifyEmail } from "../email/verify.template";
import { otpEnum } from "src/common/enums/otp.enum";

export const emailEvent=new EventEmitter();

interface IEmail extends Mail.Options{
    otp:string;
    subject?: string;
    html?: string;
}

emailEvent.on(otpEnum.ConfirmEmail,async(data:IEmail)=>{
    try{
        data.subject=otpEnum.ConfirmEmail;
        data.html=verifyEmail({otp:data.otp,title:"Email Confirmation"})
        await  sendEmail(data)

    }
    catch(error){
        console.log(`fail to send email`,error);
        
    }
})
emailEvent.on(otpEnum.ResetPassword,async(data:IEmail)=>{
    try{
        data.subject=otpEnum.ResetPassword;
        data.html=verifyEmail({otp:data.otp,title:"Reset Password"})
        await  sendEmail(data)

    }
    catch(error){
        console.log(`fail to send email`,error);
        
    }
})