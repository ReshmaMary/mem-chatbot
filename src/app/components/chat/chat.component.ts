import { Component } from '@angular/core';

import { client } from './../../dialog-flow-client/dialog-flow.client';
import { IMessage } from './../../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  conversation: IMessage[] = [];
  payloadintents = ["numem.admissions.deadlines","numem.program","numem.admission.requirements",
"numem.admission.online","numem.tuition.cost","numem.stem","numem.curriculum","numem.course.catalog"];
  
  addMessageFromUser(message) {
    this.conversation.push({
      avatar: 'perm_identity',
      from: 'Me',
      content: message.value,
      link:null
    });

    client.textRequest(message.value).then((response) => {
      var parsedResult = JSON.parse(JSON.stringify(response.result));
      var metadata  = parsedResult['metadata'];
      var intentName = metadata['intentName'];
      if(intentName !=null && intentName!= undefined && this.payloadintents.includes(intentName))
      {
        var  messages = response.result.fulfillment['messages'];
        if (messages != null && messages !== undefined){
          var payload  =  messages[0]['payload']
          };
          this.conversation.push({
            avatar: 'android',
            from: 'Bot',
            content: payload['fulfillmentText'] || 'I can\'t seem to figure that out!',
            link:payload['link']
          });
      }
      else{
        this.conversation.push({
          avatar: 'android',
          from: 'Bot',
          content: response.result.fulfillment['speech'] || 'I can\'t seem to figure that out!',
          link:null
        });
      }
      message.value = '';
    });
  }
}
