import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit, OnChanges {

  @Input('url') url: string;
  @Input('id') id: number;
  @Input('newWindow') newWindow: boolean = false;
  @Input('label') label: string = "Détails"
  @Input('icon') icon: string = ""
  @Input('class') class: string = "p-button-success"


  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id && changes.id.currentValue) {
      this.id = changes.id.currentValue
    }
    if (changes.url && changes.url.currentValue) {
      this.url = changes.url.currentValue
    }
    if (changes.newWindow && changes.newWindow.currentValue) {
      this.newWindow = changes.newWindow.currentValue
    }
    if (changes.label && changes.label.currentValue) {
      this.label = changes.label.currentValue
    }
    if (changes.icon && changes.icon.currentValue) {
      this.icon = changes.icon.currentValue
    }
    if (changes.class && changes.class.currentValue) {
      this.class = changes.class.currentValue
    }
  }

  ngOnInit(): void {

  }
  redirect() {
    if (!this.newWindow) {
      this.router.navigate([this.url, this.id]);
    }
    else
      window.open(`${this.url}`)
  }

}
