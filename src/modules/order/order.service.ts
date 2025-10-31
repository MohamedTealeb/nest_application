import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { OrderDocument, OrderProduct } from 'src/DB/model/oreder.model';
import { OrderRepository } from 'src/DB/repository/order.repository';
import { CartRepository } from 'src/DB/repository/cart.repository';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { IOrderProduct } from 'src/common/interfaces/order.interface';
import { randomUUID } from 'crypto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartService: CartService,
  ) {}
 async create(createOrderDto: CreateOrderDto,user:UserDocument): Promise<OrderDocument> {
  const cart=await this.cartService.findOne(user);
  if(!cart?.products?.length){
    throw new BadRequestException('cart is empty');
  }
  let total:number=0;
  const products:OrderProduct[]=[]
  for(const product of cart.products){
  const checkProduct=await this.productRepository.findOne({filter:{_id:product.productId,stock:{$gte:product.quantity}}});
  if(!checkProduct){
    throw new BadRequestException(`fail to find matching product with id ${product.productId} or product is out of stock`);
  }
  const finalPrice=product.quantity*checkProduct.salePrice;
products.push({
  name:checkProduct.name,
  productId:checkProduct._id,
  quantity:product.quantity,
  unitPrice:checkProduct.salePrice,
  finalPrice,
})
 total+=finalPrice;
  }

    const order=await this.orderRepository.create({data:{
      ...createOrderDto,
      orderId:randomUUID().slice(0,8),
      total,
      products,
      createdBy:user._id,




    }})
    if(!order){
      throw new BadRequestException('fail to create order');
    }
    for(const product of cart.products){
    await this.productRepository.updateOne({filter:{_id:product.productId},update:{$inc:{__v:1,stock:-product.quantity}}});
   
      }
      await this.cartService.removeCart(user);
    
    
    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
