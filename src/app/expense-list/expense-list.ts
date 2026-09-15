    import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExpenseService } from '../services/expense';

import { ExpenseCategory } from '../models/expense.model';

import { CategoryIconPipe } from '../pipes/category-icon-pipe';

import { HighlightOverBudgetDirective } from '../directives/highlight-over-budget';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-expense-list',
  standalone: true,

  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    CategoryIconPipe,
    HighlightOverBudgetDirective,
    SelectModule,
    InputTextModule,
    ButtonModule
  ],

  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseList implements OnInit {

  expenseService = inject(ExpenseService);



  categories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other'
  ];


  sortOptions = [
    {
      label: 'Date',
      value: 'date'
    },
    {
      label: 'Amount',
      value: 'amount'
    }
  ];


  orderOptions = [
    {
      label: 'Descending',
      value: 'desc'
    },
    {
      label: 'Ascending',
      value: 'asc'
    }
  ];



  categoryOptions = [
    'All',
    ...this.categories
  ];


  selectedCategory =
    signal<'All' | ExpenseCategory>('All');

  searchText =
    signal('');

  sortBy =
    signal<'date' | 'amount'>('date');

  sortDir =
    signal<'asc' | 'desc'>('desc');


  ngOnInit() {

    this.expenseService.getExpenses();

  }



  filteredExpenses = computed(() => {

    const expenses =
      this.expenseService.expenses();

    const category =
      this.selectedCategory();

    const search =
      this.searchText()
        .toLowerCase()
        .trim();

    const sortBy =
      this.sortBy();

    const sortDir =
      this.sortDir();


    let list = expenses.filter(expense => {

      const matchesCategory =
        category === 'All' ||
        expense.category === category;

      const matchesSearch =
        (expense.note ?? '')
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesSearch;

    });



    list.sort((a, b) => {

      let comparison = 0;


      if (sortBy === 'amount') {

        comparison =
          a.amount - b.amount;

      } else {

        comparison =
          new Date(a.date).getTime() -
          new Date(b.date).getTime();

      }


      return sortDir === 'asc'
        ? comparison
        : -comparison;

    });


    return list;

  });


  searchByNote(event: Event) {

    const input =
      event.target as HTMLInputElement;

    this.searchText.set(
      input.value
    );

  }


  changeCategory(
    category: 'All' | ExpenseCategory
  ) {

    this.selectedCategory.set(
      category
    );

  }


  changeSortBy(value: 'date' | 'amount') {

    this.sortBy.set(value);

  }



  changeSortDir(value: 'asc' | 'desc') {

    this.sortDir.set(value);

  }


  get total(): number {

    return this.filteredExpenses()
      .reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

  }



  editExpense(expense: any) {

    this.expenseService
      .editingExpense
      .set(expense);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }



  deleteExpense(id: number) {

    const confirmed =
      confirm(
        'Are you sure you want to delete this expense?'
      );


    if (!confirmed) {
      return;
    }


    this.expenseService
      .deleteExpense(id)
      .subscribe({

        next: () => {
          this.expenseService
            .getExpenses();

        },

        error: (error) => {

          console.error(
            'Error deleting expense:',
            error
          );

        }

      });

  }

}