import { Component } from '@angular/core';

type LoginStatus = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'ok'; message: string };

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username = '';
  password = '';
  status: LoginStatus = { kind: 'idle' };

  onSubmit(): void {
    if (!this.username.trim() || !this.password) {
      this.status = { kind: 'error', message: 'ERR: missing credentials' };
      return;
    }

    this.status = { kind: 'error', message: 'ERR: access denied (stub)' };
  }
}
