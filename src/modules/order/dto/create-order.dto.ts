import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { PaymentType } from "src/common/enums/payment.enums";
import { IOrder } from "src/common/interfaces/order.interface";

export class CreateOrderDto implements Partial<IOrder> {
    @IsString()
    address: string
    @IsString()
    @IsOptional()
    note: string 
    @Matches(/^(002|\+2)?01[0125][0-9]{8}$/)
    @IsString()
    phone: string 
    @IsEnum(PaymentType)
    paymentType?: PaymentType 

    
}
