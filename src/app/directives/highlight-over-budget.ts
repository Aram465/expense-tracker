  import {
  Directive,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appHighlightOverBudget]',
  standalone: true
})
export class HighlightOverBudgetDirective {

  @Input()
  appHighlightOverBudget = 0;

  @Input()
  threshold = 100;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges() {

    const row =
      this.element.nativeElement as HTMLElement;

    const cells =
      row.querySelectorAll('td');

    if (
      this.appHighlightOverBudget >
      this.threshold
    ) {

      this.renderer.setStyle(
        row,
        'background-color',
        '#fff1f2'
      );

      this.renderer.setStyle(
        row,
        'border-left',
        '4px solid #fb7185'
      );

      cells.forEach((cell: Element) => {

        this.renderer.setStyle(
          cell,
          'background-color',
          '#fff1f2'
        );

      });

    } else {

      this.renderer.setStyle(
        row,
        'background-color',
        '#ffffff'
      );

      this.renderer.removeStyle(
        row,
        'border-left'
      );

      cells.forEach((cell: Element) => {

        this.renderer.setStyle(
          cell,
          'background-color',
          '#ffffff'
        );

      });

    }
  }
}