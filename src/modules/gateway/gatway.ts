import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Server } from "socket.io";
import { TokenSecurity } from "src/common/utils/security/token.security";
import { getSocketAuth } from "src/common/utils/socket";
import type { ISocket } from "src/common/interfaces/socket.interface";
import { UserRepository } from "src/DB/repository/user.repository";
import { connectedSocket } from "src/DB/model/user.model";
import { RoleEnum } from "src/common/enums/user.enum";
import { Auth } from "src/common/decoretors/auth.decoretors";
import { Types } from "mongoose";

@WebSocketGateway({
    cors:{
        origin:"*",
    },
   
})
export class RealtimeGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect {
@WebSocketServer()
    private readonly server:Server
    constructor(
        private readonly tokenSecurity:TokenSecurity,
        private readonly userRepository:UserRepository
    ){}
    afterInit(server: any) {
        console.log("Realtime server started")
    }

  async  handleConnection(client: ISocket) {
    try{
        console.log("Client connecting:", client.id)
        const authorization=getSocketAuth(client)
        if(!authorization){
            client.emit("exception","missing authorization token")
            client.disconnect(true)
            return
        }
        const token=authorization.replace('Bearer ','')
        const decoded=await this.tokenSecurity.verifyToken({
            token,
            secret: process.env.JWT_SECRET || 'default-secret'
        })
        if(!decoded || !(decoded as any)?.sub){
            client.emit("exception","invalid or expired token")
            client.disconnect(true)
            return
        }
        const userId=(decoded as any).sub
        const user=await this.userRepository.findOne({filter:{_id:userId}})
        if(!user){
            client.emit("exception","user not found")
            client.disconnect(true)
            return
        }
        const userTaps=connectedSocket.get(user._id!.toString())||[]
        userTaps.push(client.id)
        connectedSocket.set(user._id!.toString(),userTaps)

        client.credentials={user:user as any,decode:decoded}
        console.log("Client connected successfully:", client.id, "User:", userId)
    }catch(error){
        console.log("Connection error:",error)
        client.emit("exception","invalid or expired token")
        client.disconnect(true)
        return
    }
    }
    handleDisconnect(client: ISocket) {
        console.log("Client disconnected",client.id)
        try{
        const userId=client.credentials?.user?._id.toString() as string
        let remainTaps=connectedSocket.get(userId)?.filter((tabb:string)=>{
            return tabb!==client.id
        })||[]
        if(remainTaps.length){
            connectedSocket.set(userId,remainTaps)
        }else{
            connectedSocket.delete(userId)
            this.server.emit("offline_user",userId)
        }
    }catch(error){
        console.log("Disconnect error:",error)
    }
    }

    @Auth([RoleEnum.ADMIN])
    @SubscribeMessage("sayHi")
    sayHi(@MessageBody() data:any  ,@ConnectedSocket() client:ISocket){
        console.log({user:client.credentials?.user,decode:client.credentials?.decode})
        this.server.emit("sayHi",data)

         return "Received Data"
    }

    changeProductStock(products:{productId:Types.ObjectId,stock:number}[]){

     this.server.emit("changeProductStock",products)
    }
   



}