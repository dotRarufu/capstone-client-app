import {Component }from "@angular/core";
import { ModalComponent } from "./modal.component";
import { FeatherIconsModule } from "src/app/modules/feather-icons.module";

@Component({
    selector: "AddTaskModal",
    standalone: true,
    imports: [ModalComponent, FeatherIconsModule],
    template: `
    <Modal inputId="addTask">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              placeholder="Task Title"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
            />
          </div>
          <!-- <label
            for="add-task"
            class="btn-ghost btn-sm btn-circle btn text-primary-content/60"
            ><i-feather class="text-base-content/70" name="x"></i-feather
          ></label> -->
        </div>

        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <textarea
              class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
              placeholder="Description"
            ></textarea>
          </div>
          <ul class="w-full flex sm1:w-[223px]  flex-col bg-neutral/20 p-0 py-2">
            <button class="btn-ghost btn flex text-base-content justify-start gap-2 rounded-[3px]">
              <i-feather class="text-base-content/70" name="check-square" />
              done
            </button>

            <div class="h-full"></div>
            <button
              class="btn-ghost btn flex text-base-content justify-start gap-2 rounded-[3px]"
            >
              <i-feather class="text-base-content/70" name="x-circle" />
              close
            </button>
          </ul>
        </div>
      </div>
    </Modal>
    `
})
export class AddTaskModalComponent {

}