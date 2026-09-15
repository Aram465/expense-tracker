import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/expenses';

  expenses = signal<Expense[]>([]);

  editingExpense = signal<Expense | null>(null);


  // GET
  getExpenses() {
    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('GET DATA:', data);
        this.expenses.set(data);
      },
      error: (error) => {
        console.error('GET ERROR:', error);
      }
    });
  }


  // ADD
  addExpense(expense: Expense) {

    console.log('POST DATA:', expense);

    return this.http.post<Expense>(
      this.apiUrl,
      expense
    );

  }


  // UPDATE
  updateExpense(id: number, expense: Expense) {

    return this.http.put<Expense>(
      `${this.apiUrl}/${id}`,
      expense
    );

  }


  deleteExpense(id: number) {

    return this.http.delete<void>(`
      ${this.apiUrl}/${id}
    `);

  }

}