import { Injectable } from '@angular/core';
import { Notification, TYPE, ANSWER } from '../model/notification';
import { MetaInfo } from '../model/models';


@Injectable({
  providedIn: 'root'
})
export class NotificationBuilderService {

  private notification:Notification;

  constructor() { 
    this.notification = <Notification>{}
  }

  setOwner(owner:string){
    this.notification.owner = owner
  }

  setCreator(creator:string){
    let meta:MetaInfo = <MetaInfo>{}
    meta.creators = []
    meta.creators.push(creator)
    this.notification.meta = meta
  }

  setFrom(from:string){
    this.notification.from = from
  }

  setTo(to:string){
    this.notification.to = to
  }

  setType(type:TYPE){
    this.notification.type = type.toString()
  }

  setAnswer(answer:ANSWER){
    this.notification.answer = answer.toString()
  }

  setBody(body:string){
    this.notification.body = body
  }

  setOrganizationInv(org:string){
    this.notification.invitationTo = org
  } 

  setEntityShared(entityId:string){
    this.notification.entityShared = entityId
  }

  setViewd(viewed:boolean){
    this.notification.viewed = viewed
  }

  setThroughOrg(throughOrg:string){
    this.notification.organizationShared = throughOrg
  }

  setAffiliatedOrg(affOrg:string){
    this.notification.affiliatedOrg = affOrg
  }


  build(){
    return this.notification
  }

}