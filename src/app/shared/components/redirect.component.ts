import { ActivatedRoute, Router, } from '@angular/router';
import { Component, } from '@angular/core';

@Component({
  template: ''
})
export class RedirectComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      const path = this.route.snapshot.data['path'];
      const projectId = this.route.snapshot.paramMap.get('projectId')
      this.router.navigate([...path, projectId, 'tasks'])
    });
  }

}