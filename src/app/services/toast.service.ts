import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'success', durationMs = 3000): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, message, type }]);

    setTimeout(() => {
      this.toasts.update(list => list.filter(t => t.id !== id));
    }, durationMs);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
}