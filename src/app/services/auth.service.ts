import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type AuthState =
  | { isAuthenticated: false }
  | { isAuthenticated: true; username: string };

const STORAGE_KEY = 'np_admin_session_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly stateSubject = new BehaviorSubject<AuthState>(this.readState());
  readonly state$ = this.stateSubject.asObservable();

  get isAuthenticated(): boolean {
    return this.stateSubject.value.isAuthenticated;
  }

  get username(): string | null {
    return this.stateSubject.value.isAuthenticated ? this.stateSubject.value.username : null;
  }

  login(username: string, password: string): { ok: true } | { ok: false; message: string } {
    const trimmed = username.trim();
    if (!trimmed || !password) {
      return { ok: false, message: 'ERR: missing credentials' };
    }

    if (!(trimmed === 'admin' && password === 'null_pointer')) {
      return { ok: false, message: 'ERR: access denied' };
    }

    const state: AuthState = { isAuthenticated: true, username: trimmed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    this.stateSubject.next(state);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.stateSubject.next({ isAuthenticated: false });
  }

  private readState(): AuthState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { isAuthenticated: false };
      }
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      if (parsed && (parsed as AuthState).isAuthenticated && typeof (parsed as any).username === 'string') {
        return { isAuthenticated: true, username: (parsed as any).username };
      }
      return { isAuthenticated: false };
    } catch {
      return { isAuthenticated: false };
    }
  }
}

