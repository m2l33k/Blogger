import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-live-attacks-page',
  templateUrl: './live-attacks-page.component.html',
  styleUrls: ['./live-attacks-page.component.css']
})
export class LiveAttacksPageComponent {
  mapUrl: SafeResourceUrl;
  externalUrl = 'https://livethreatmap.radware.com/';

  constructor(private readonly sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.externalUrl);
  }
}

