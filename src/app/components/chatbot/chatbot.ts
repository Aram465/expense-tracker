    import {
  Component,
  ChangeDetectorRef,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AiChatbotService } from '../../services/ai-chatbot';
import { ExpenseService } from '../../services/expense';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-chatbot',
  standalone: true,

  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule
  ],

  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent {

  private aiChatbotService = inject(AiChatbotService);
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  message = '';

  loading = signal(false);

  sessionId = crypto.randomUUID();

  messages = signal<
    {
      text: string;
      sender: 'user' | 'ai';
    }[]
  >([]);


  sendMessage() {

    const text = this.message.trim();

    // Don't send empty messages
    // Don't send another message while waiting
    if (!text || this.loading()) {
      return;
    }


    // Add user message
    this.messages.update(currentMessages => [
      ...currentMessages,
      {
        text: text,
        sender: 'user'
      }
    ]);


    // Clear input
    this.message = '';


    // Start loading
    this.loading.set(true);


    // Prepare request
    const request = {
      message: text,
      sessionId: this.sessionId,
      expenses: this.expenseService.expenses()
    };


    console.log('CHAT REQUEST:', request);


    // Send request to AI
    this.aiChatbotService
      .sendMessage(request)
      .subscribe({

        next: (response) => {

          console.log('CHAT RESPONSE:', response);


          // Remove "=" if n8n sends it
          const reply = response?.reply
            ?.replace(/^=/, '')
            .trim();


          // Add AI response
          this.messages.update(currentMessages => [
            ...currentMessages,
            {
              text: reply || 'No response received.',
              sender: 'ai'
            }
          ]);


          // Stop loading
          this.loading.set(false);


          console.log(
            'LOADING AFTER RESPONSE:',
            this.loading()
          );


          // Force UI update
          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Chatbot Error:',
            error
          );


          // Stop loading
          this.loading.set(false);


          // Show error
          this.messages.update(currentMessages => [
            ...currentMessages,
            {
              text:
                'Sorry, the AI service is currently unavailable. Please try again.',
              sender: 'ai'
            }
          ]);


          // Force UI update
          this.cdr.detectChanges();


          console.log(
            'LOADING AFTER ERROR:',
            this.loading()
          );

        }

      });
  }
}