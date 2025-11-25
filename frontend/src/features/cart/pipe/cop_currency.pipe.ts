// cop-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'copCurrency',
  standalone: true
})
export class CopCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '';

    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);

    // Para que quede "$120.000" sin espacios raros
    return formatted.replace(/\s/g, '');
  }
}
