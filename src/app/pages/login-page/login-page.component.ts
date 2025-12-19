import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  onSubmit(): void {
    const result = this.auth.login(this.username, this.password);
    if (!result.ok) {
      this.status = { kind: 'error', message: result.message };
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.status = { kind: 'ok', message: 'OK: authenticated' };
    this.router.navigateByUrl(returnUrl || '/admin');
  }
}
