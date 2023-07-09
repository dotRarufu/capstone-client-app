import { Component } from '@angular/core';
import { ProjectLayoutComponent } from 'src/app/layouts/project.component';
import { SideBarComponent } from 'src/app/student/components/sidebar.component';

@Component({
  standalone: true,
  imports: [ProjectLayoutComponent, SideBarComponent],
  selector: 'Project',
  template: `
    <ProjectLayout>
      <SideBar />
    </ProjectLayout>
  `,
})
export class CapstoneAdviserProjectComponent {}
