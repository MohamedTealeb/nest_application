import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let authorization:string=''
  switch(context.getType()){
    case 'http':
      const request=context.switchToHttp()
      const req=request.getRequest();
      authorization=req.headers['authorization'] ?? ''
      break;


      // case 'rpc':
      //   const request_rpc=context.switchToRpc().getContext();
      //   break;

      //   case 'ws':
      //     const request_ws=context.switchToWs().getClient();
      //     break;

    default:
    break;
  }
    return false;
  }
}
