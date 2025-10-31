import { Types } from "mongoose";
import { IProduct } from "./product.interface";
import { OrderStatus, PaymentType } from "../enums/payment.enums";
import { IUser } from "./user.interfaces";

export interface IOrderProduct {
    _id?:Types.ObjectId,
    productId:Types.ObjectId | IProduct,
    name:string,
    quantity:number,
    unitPrice:number,
    finalPrice:number,

    createdAt?:Date,
    updatedAt?:Date,

}


export interface IOrder {
    _id?:Types.ObjectId,
    orderId:string,
    address:string,
    phone:string,
    note?:string,
    products:IOrderProduct[],
    subTotal:number,
    discount?:number,
    total:number,
    paymentType:PaymentType,
    status:OrderStatus,
    cancelReason?:string,




    createdAt?:Date,
    updatedAt?:Date,

    freezedAt?:Date,
    restoredAt?:Date,
    updatedBy?:Types.ObjectId | IUser,
    createdBy:Types.ObjectId | IUser,
}