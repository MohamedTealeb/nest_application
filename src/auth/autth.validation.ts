import { z } from 'zod';
export const signupValidation = z.strictObject({
    username:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(6),
    ConfirmPassword:z.string().min(6)
}).superRefine((data,ctx) => {
    if(data.password!==data.ConfirmPassword){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Password not match"
        })
    }
})
