  import { Component, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { ExpenseService } from '../../services/expense';
import {
  Expense,
  ExpenseCategory
} from '../../models/expense.model';

import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ButtonModule
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css'
})
export class ExpenseForm {

  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);

  editingId: number | null = null;
  today = new Date();

  categories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other'
  ];

  futureDateValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      return {
        futureDate: true
      };
    }

    return null;
  }

  form = this.fb.group({
    amount: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    category: [
      '' as ExpenseCategory,
      Validators.required
    ],

    date: [
      '',
      [
        Validators.required,
        this.futureDateValidator
      ]
    ],

    note: [
      '',
      Validators.maxLength(200)
    ]
  });

  constructor() {

    effect(() => {

      const expense =
        this.expenseService.editingExpense();

      if (expense) {

        this.editingId = expense.id;

        this.form.patchValue({
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          note: expense.note || ''
        });

      } else {

        this.editingId = null;

      }

    });

  }

  submitForm() {

    console.log('SUBMIT CLICKED');

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      console.log('FORM IS INVALID');

      return;
    }

    console.log('FORM IS VALID');

    const expense: Expense = {

      id: this.editingId ?? Date.now(),

      amount: Number(
        this.form.value.amount
      ),

      category:
        this.form.value.category as ExpenseCategory,

      date:
        this.form.value.date!,

      note:
        this.form.value.note || ''
    };

    console.log('EXPENSE:', expense);


    if (this.editingId !== null) {

      this.expenseService
        .updateExpense(
          this.editingId,
          expense
        )
        .subscribe({

          next: () => {

            console.log('EXPENSE UPDATED');

            this.expenseService.getExpenses();

            this.cancelEdit();

          },

          error: (error) => {

            console.error(
              'Error updating expense:',
              error
            );

          }

        });

    }


    else {

      this.expenseService
        .addExpense(expense)
        .subscribe({

          next: (data) => {

            console.log(
              'EXPENSE ADDED:',
              data
            );

            this.expenseService.getExpenses();

            this.form.reset({

              amount: 0,

              category:
                '' as ExpenseCategory,

              date: '',

              note: ''

            });

          },

          error: (error) => {

            console.error(
              'Error adding expense:',
              error
            );

          }

        });

    }

  }

  cancelEdit() {

    this.editingId = null;

    this.expenseService
      .editingExpense
      .set(null);

    this.form.reset({

      amount: 0,

      category:
        '' as ExpenseCategory,

      date: '',
      note: ''

    });

  }

}