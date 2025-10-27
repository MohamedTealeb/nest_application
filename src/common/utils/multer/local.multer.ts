import { diskStorage } from "multer";
import { Request } from "express";
import { randomUUID } from "crypto";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { IMulterFile } from "src/common/interfaces/multer.interface";
import { BadRequestException } from "@nestjs/common";
import { file } from "zod";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const localFileUpload = ({ folder = "public" ,vaildation=[],fileSize=2}: { folder?: string ,vaildation:string[],fileSize?:number }):MulterOptions => {
  const basePath = `uploads/${folder}`;

  return {
    storage: diskStorage({
      destination(req: Request, file: Express.Multer.File, callback: Function) {
        const fullPath=path.resolve(`./${basePath}`)
        if(!existsSync(fullPath)){
            mkdirSync(fullPath, { recursive: true });
        }
        callback(null, fullPath);
      },
      filename(req: Request, file: IMulterFile, callback: Function) {
        const fileName = `${randomUUID()}_${Date.now()}_${file.originalname}`;
        file.finalPath=basePath + `/${fileName}`
        callback(null, fileName);
      },
    }),
    fileFilter(req: Request, file: IMulterFile, callback: Function) {
 
         if(vaildation.includes(file.mimetype)){
             return callback(null,true)
         }
         return callback(new BadRequestException('Invalid file type'))
    },
    limits:{
        fileSize:fileSize *1024*1024,
    }
  };
};
