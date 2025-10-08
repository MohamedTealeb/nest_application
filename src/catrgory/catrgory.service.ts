import { Injectable } from '@nestjs/common';

@Injectable()
export class CatrgoryService {

categories(){
    return [{
        id:1,
        name:"Electronics"

    }]
}


}