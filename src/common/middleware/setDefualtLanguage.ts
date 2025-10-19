import { NextFunction, Request, Response } from "express";


export const setDefaultLanguage=(req:Request,res:Response,next:NextFunction)=>{

console.log('language middleware called');
req.headers['accept-language']=req.headers['accept-language'] ?? 'EN'
next()

}
export const authenticationMiddleware=(req:Request,res:Response,next:NextFunction)=>{

console.log('authentication middleware called');
next()

}
export const authorizationMiddleware=(req:Request,res:Response,next:NextFunction)=>{

console.log('authorization middleware called');
next()

}
