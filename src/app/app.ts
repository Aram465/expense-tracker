import { Component } from '@angular/core';
import {ExpenseForm } from './components/expense-form/expense-form';
import {ExpenseList} from './expense-list/expense-list';
import { ChatbotComponent } from './components/chatbot/chatbot';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseForm,ExpenseList,ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}