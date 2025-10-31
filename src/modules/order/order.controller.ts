import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RoleEnum } from 'src/common/enums/user.enum';
import { Auth } from 'src/common/decoretors/auth.decoretors';
import { User } from 'src/common/decoretors/credential.decorator';
import type { UserDocument } from 'src/DB/model/user.model';
import { succesResponse } from 'src/common/utils/response';
import { OrderResponse } from './entities/order.entity';
import { IResponse } from 'src/common/interfaces/response.interfae';

@UsePipes(new ValidationPipe({whitelist:true ,forbidNonWhitelisted:true}))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([RoleEnum.USER])
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @User() user:UserDocument):Promise<IResponse<OrderResponse>> {
  const order= await this.orderService.create(createOrderDto,user);
    return succesResponse<OrderResponse>({data:{order},status:201})
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
