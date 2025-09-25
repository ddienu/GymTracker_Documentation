// src/app/shared/alert.util.ts
import Swal, { SweetAlertIcon } from 'sweetalert2';

export class AlertUtil {
  // 🔹 Toast genérico (notificaciones tipo snackbar)
  static toast(message: string, icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      toast: true,
      position: 'top-right',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'toast',
      },
    });
  }

  // 🔹 Modal de confirmación (decisiones: sí/no)
  static confirm(text: string) {
    return Swal.fire({
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
      width: '350px',
      customClass: {
        popup: 'toast',
        confirmButton: 'confirm-btn',
        icon: 'color-icn',
      },
    });
  }

  // 🔹 Modal de éxito
  static success(message: string) {
    return Swal.fire({
      icon: 'success',
      text: message,
      width: '350px',
      customClass: {
        popup: 'toast',
        confirmButton: 'confirm-btn',
      },
    });
  }

  // 🔹 Mensaje de error con cierre automático luego de 2.5 segundos
  static error(message: string) {
    return Swal.fire({
      icon: 'error',
      text: message,
      width: '350px',
      position: 'top-right',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2500,
      customClass:{
        popup: 'toast'
      }
    });
  }
}
