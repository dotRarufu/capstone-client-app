import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public theme = signal<string>(
    localStorage.getItem('capstoneTheme') || 'original'
  );
  themeEffect = effect(() => {
    document.querySelector('html')?.setAttribute('data-theme', this.theme());
    localStorage.setItem('capstoneTheme', this.theme());
  });
}
