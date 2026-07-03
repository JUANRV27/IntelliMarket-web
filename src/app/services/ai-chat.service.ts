import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AiChatRequest } from '../models/ai-chat-request';
import { AiChatResponse } from '../models/ai-chat-response';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/ai/chat`;

  /**
   * Envía un mensaje en texto libre (o el texto de una sugerencia)
   * al asistente IA. El backend decide qué tool ejecutar
   * (consultar stock, agregar al carrito, registrar venta, etc.)
   * según el rol del usuario autenticado.
   */
  sendMessage(message: string): Observable<AiChatResponse> {
    const payload: AiChatRequest = { message };
    return this.http.post<AiChatResponse>(this.baseUrl, payload);
  }

  /**
   * Obtiene las sugerencias (chips) predefinidas para el chat.
   * El backend ya devuelve un set distinto según si el usuario
   * autenticado es CUSTOMER o SELLER.
   */
  ggetSuggestions(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/v1/ai/suggestions`);  
  }
}