import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-measures-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './measures-chart.component.html',
  styleUrl: './measures-chart.component.css',
})
export class MeasuresChartComponent implements AfterViewInit, OnInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
  measuresByMonth: Record<string, number[]> = {};

  selectedMonth: string = 'Enero';

  ngOnInit(): void {
    // 👇 Aquí simulo datos del backend
    this.measuresByMonth = {
      Enero: [70, 32, 55, 80, 23, 18], // peso(kg), brazo(cm), pierna(cm), cintura(cm), IMC, % grasa
      Febrero: [71, 33, 56, 81, 23.5, 17.8],
      Marzo: [72, 34, 57, 82, 24, 18.5],
      Abril: [73, 34.5, 58, 83, 24.2, 19],
      Mayo: [80, 36, 59, 86, 25.3, 24],
    };
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Peso (kg)', 'Brazo (cm)', 'Pierna (cm)', 'Cintura (cm)', 'IMC', '% Grasa'],
        datasets: [
          {
            label: this.selectedMonth,
            data: this.measuresByMonth[this.selectedMonth],
            backgroundColor: [
              '#f97316', // Naranja
              '#3b82f6', // Azul
              '#ef4444', // Rojo
              '#22c55e', // Verde
              '#a855f7', // Morado
              '#eab308'  // Amarillo
            ],
            borderRadius: 8, // bordes redondeados
            borderSkipped: false, // quita cortes duros
            barPercentage: 0.5,
            categoryPercentage: 0.6
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#e5e7eb', // gris claro para texto
            },
          },
          tooltip: {
            backgroundColor: '#1f2937', // fondo tooltip dark
            titleColor: '#f97316',
            bodyColor: '#f3f4f6',
            borderColor: '#374151',
            borderWidth: 1,
          },
        },
      },
    });
  }

  onMonthChange(event: Event): void {
    if (!this.chart) return; // 👈 seguridad

    const month = (event.target as HTMLSelectElement).value;
    this.selectedMonth = month;

    if (this.measuresByMonth[month]) {
      this.chart.data.datasets[0].label = month;
      this.chart.data.datasets[0].data = this.measuresByMonth[month];
      this.chart.update();
    }
  }
}
