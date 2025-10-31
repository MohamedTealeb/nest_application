import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IUser } from "src/common";
import { OrderStatus, PaymentType } from "src/common/enums/payment.enums";
import { IOrder, IOrderProduct } from "src/common/interfaces/order.interface";
import { IProduct } from "src/common/interfaces/product.interface";


@Schema({
    timestamps:true,
    strictQuery:true,
})

export class OrderProduct implements IOrderProduct {
    @Prop({type:Types.ObjectId,ref:"Product",required:true})
    productId: Types.ObjectId | IProduct;
    @Prop({type:String,required:true})
    name: string;
    @Prop({type:Number,required:true})
    quantity: number;

    @Prop({type:Number,required:true})
    finalPrice: number;
    @Prop({type:Number,required:true})
    unitPrice: number;
}
@Schema({
    timestamps:true,
    strictQuery:true,
})
export class Order implements IOrder {
    @Prop({type:String,required:true})
    address: string;
    @Prop({type:String})
    cancelReason: string ;
    @Prop({type:String})
  note: string ;
  @Prop({type:String,required:true})
  phone: string;
  @Prop({type:Types.ObjectId,ref:"User"})
  updatedBy: Types.ObjectId | IUser;
  @Prop({type:Types.ObjectId,ref:"User",required:true})
  createdBy: Types.ObjectId | IUser;
  @Prop({type:Number})
  discount: number;
  @Prop({type:Number})
  subTotal: number;
  @Prop({type:Number,required:true})
  total: number;

  orderId: string;
  @Prop({type:Date})
  freezedAt: Date;
  @Prop({type:Date})
  restoredAt: Date;
  @Prop({type:String,enum:PaymentType,default:PaymentType.Cash,required:true})
  paymentType: PaymentType;
  @Prop({type:String,enum:OrderStatus,default:function(this:Order){
      return this.paymentType===PaymentType.Card ?OrderStatus.Pending:OrderStatus.Placed;
  },required:true})
  status: OrderStatus;
  @Prop([OrderProduct])
  products: OrderProduct[];

}
export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
export const    OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
OrderSchema.pre('save',function(next){
if(this.isModified('total')){
this.subTotal=this.total - (this.total * ((this.discount??0)/100));
  }
  next();
});
export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]);