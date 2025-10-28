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

    if (accessRoles.length === 0) {
      return true;
    }

    let role: RoleEnum | undefined;
    switch(context.getType()){
      case 'http':
        const req = context.switchToHttp().getRequest();
        role = (req.credentials?.user?.role as RoleEnum | undefined);
        break;
    } 

    if (!role) {
      return false;
    }

    return accessRoles.includes(role)
  }
}
