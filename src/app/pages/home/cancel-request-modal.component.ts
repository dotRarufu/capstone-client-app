import { Component, inject } from '@angular/core';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { HomeStateService } from './data-access/home-state.service';
import { map, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'cancel-request-modal',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <modal inputId="cancelRequestModal">
      <div
        class="sm1:w-sm flex w-full flex-col items-center gap-6 rounded-[3px] border border-base-content/10 bg-base-100 p-4"
      >
        <h2 class="text-[18px] text-base-content">
          Are you sure you want to cancel this request?
        </h2>
        <div class=" flex w-full">
          <button
          onclick="cancelRequestModal.close()"
          class=" btn-ghost btn w-1/2 text-error">No</button>
          <button
          onclick="cancelRequestModal.close()"

            (click)="cancelRequest()"
            class="btn-ghost btn w-1/2 text-success"
          >
            Yes
          </button>
        </div>
      </div>
    </modal>
  `,
})
export class CancelRequestModalComponent {
  projectService = inject(ProjectService);
  homeStateService = inject(HomeStateService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  cancelRequest() {
    this.spinner.show();
    
    const cancelRequest$ = this.homeStateService.activeRequestId$.pipe(
      map((id) => {
        if (id === null) throw new Error('No project id passed');
        
        return id;
      }),
      switchMap((id) => this.projectService.cancelRequest(id)),
      tap(() => this.homeStateService.updateRequests())
    );

    cancelRequest$.subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success('Request cancelled')},
      error: (err) => {
        console.log("err:", err)
        this.spinner.hide();
        this.toastr.error(err)},
    });
  }
}
