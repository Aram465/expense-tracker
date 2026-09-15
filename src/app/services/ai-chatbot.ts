  import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatbotRequest {
  message: string;
  sessionId: string;
  expenses: any[];
}

export interface ChatbotResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatbotService {

  private http = inject(HttpClient);

  sendMessage(request: ChatbotRequest): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(
      environment.aiAgentWebhookUrl,
      request
    );
  }
}