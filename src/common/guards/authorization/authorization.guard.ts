import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { roleName } from 'src/common/decoretors/role.decorator';
import { RoleEnum } from 'src/common/enums/user.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}
  canActivate( 
    context: ExecutionContext,
  ): boolean {
    const accessRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(roleName, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];



    let role: RoleEnum = RoleEnum.USER;
    switch(context.getType()){
      case 'http':
        role=context.switchToHttp().getRequest().credentials.user.role

      break;
    } 



    return accessRoles.includes(role)
  }
}
