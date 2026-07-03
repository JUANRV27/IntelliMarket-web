import { Component, ElementRef, ViewChild, AfterViewChecked, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../../services/ai-chat.service';
import { TokenService } from '../../../services/token.service';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bubble.html',
  styleUrls: ['./chat-bubble.css']
})
export class ChatBubble implements AfterViewChecked {
  private aiChatService = inject(AiChatService);
  tokenService = inject(TokenService);

  @ViewChild('messagesEnd') private messagesEnd?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  isLoading = signal(false);
  draft = signal('');
  messages = signal<ChatMessage[]>([]);
  suggestions = signal<string[]>([]);
  suggestionsLoaded = signal(false);

  private shouldScroll = false;

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  togglePanel(): void {
    this.isOpen.update(v => !v);

    if (this.isOpen()) {
      if (!this.suggestionsLoaded()) {
        this.loadSuggestions();
      }
      if (this.messages().length === 0) {
        this.messages.set([{
          from: 'bot',
          text: '¡Hola! Soy tu asistente IntelliMarket. Puedes escribirme o elegir una de las sugerencias de abajo.'
        }]);
      }
      this.shouldScroll = true;
    }
  }

  closePanel(): void {
    this.isOpen.set(false);
  }

  loadSuggestions(): void {
    this.aiChatService.getSuggestions().subscribe({
      next: (list) => {
        this.suggestions.set(list ?? []);
        this.suggestionsLoaded.set(true);
      },
      error: () => {
        // Si falla, simplemente no mostramos chips; el chat sigue funcionando con texto libre.
        this.suggestionsLoaded.set(true);
      }
    });
  }

  sendSuggestion(text: string): void {
    this.sendMessage(text);
  }

  sendDraft(): void {
    const text = this.draft().trim();
    if (!text) return;
    this.draft.set('');
    this.sendMessage(text);
  }

  private sendMessage(text: string): void {
    this.messages.update(list => [...list, { from: 'user', text }]);
    this.isLoading.set(true);
    this.shouldScroll = true;

    this.aiChatService.sendMessage(text).subscribe({
      next: (res) => {
        this.messages.update(list => [...list, {
          from: 'bot',
          text: res.summary,
          isError: !res.success
        }]);
        this.isLoading.set(false);
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.update(list => [...list, {
          from: 'bot',
          text: 'Ocurrió un error al contactar al asistente. Intenta nuevamente.',
          isError: true
        }]);
        this.isLoading.set(false);
        this.shouldScroll = true;
      }
    });
  }

  private scrollToBottom(): void {
    this.messagesEnd?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}