import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/components/sidebar.component';
import { ProjectLayoutComponent } from 'src/app/layouts/project.component';

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
export class ProjectPageComponent {}
