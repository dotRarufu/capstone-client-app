import { Component} from '@angular/core';

@Component({
  selector: 'StudentParticipants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex items-center justify-between">
        <h1 class="text-[24px] text-base-content sm1:text-[32px]">
          Participants
        </h1>
        <label
          for="add-participant"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus"></i-feather>

          Add
        </label>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex w-full flex-col justify-center gap-2">
        <div
          class="flex items-center gap-2 rounded-[3px] border border-base-content/30 bg-base-100 p-3 sm1:p-4 "
        >
          <div class="placeholder avatar">
            <div
              class="w-[40px] rounded-full bg-neutral-focus text-neutral-content sm1:w-[48px]"
            >
              <span class="text-xl sm1:text-3xl">K</span>
            </div>
          </div>

          <div class="flex w-full flex-col">
            <h1 class="text-base text-base-content sm1:text-[20px] ">
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather class="text-base-content/70" name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="flex items-center gap-2 rounded-[3px] border border-base-content/30 bg-base-100 p-3 sm1:p-4 "
        >
          <div class="placeholder avatar">
            <div
              class="w-[40px] rounded-full bg-neutral-focus text-neutral-content sm1:w-[48px]"
            >
              <span class="text-xl sm1:text-3xl">K</span>
            </div>
          </div>

          <div class="flex w-full flex-col">
            <h1 class="text-base text-base-content sm1:text-[20px] ">
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather class="text-base-content/70" name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="flex items-center gap-2 rounded-[3px] border border-base-content/30 bg-base-100 p-3 sm1:p-4 "
        >
          <div class="placeholder avatar">
            <div
              class="w-[40px] rounded-full bg-neutral-focus text-neutral-content sm1:w-[48px]"
            >
              <span class="text-xl sm1:text-3xl">K</span>
            </div>
          </div>

          <div class="flex w-full flex-col">
            <h1 class="text-base text-base-content sm1:text-[20px] ">
              Gardo Versoza
            </h1>
            <p class=" text-base text-base-content/70">Role</p>
          </div>

          <div class="dropdown-end dropdown text-base-content">
            <label tabindex="0" class="btn-ghost btn-sm btn">
              <i-feather class="text-base-content/70" name="menu"></i-feather>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu w-52 border border-base-content/30 bg-base-100 shadow-md"
            >
              <li>
                <a
                  class="rounded-[3px] hover:rounded-[3px] focus:rounded-[3px] "
                  >Remove</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <Modal inputId="add-participant">
      <div
        class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between">
            <input
              type="text"
              placeholder="User ID"
              class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
            />
          </div>

          <!-- <label
            for="add-participant"
            class="btn-ghost btn-sm btn-circle btn text-primary-content/60"
            ><i-feather class="text-base-content/70" name="x"></i-feather
          ></label> -->
        </div>

        <div class="flex bg-base-100">
          <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Role</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div
              class="form-control rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50"
            >
              <div
                class="input-group rounded-[3px] border border-base-content/50"
              >
                <select
                  class="select-bordered select w-full rounded-[3px] border-none text-base font-normal  outline-0  focus:rounded-[3px] "
                >
                  <!-- todo: make this dynamic -->
                  <option disabled selected>Select a role</option>
                  <!-- todo: rename roles table to role -->
                  <option (click)="selectRole(0)">Student</option>
                  <option (click)="selectRole(1)">Subject Adviser</option>
                  <option (click)="selectRole(2)">Technical Adviser</option>
                </select>
              </div>
            </div>
          </div>
          <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 py-2">
            <li class="btn-ghost btn flex justify-start gap-2 rounded-[3px]">
              <i-feather
                class="text-base-content/70"
                name="check-square"
              ></i-feather>
              done
            </li>

            <div class="h-full"></div>
            <label
            for="add-participant" class="btn-ghost btn flex justify-start gap-2 rounded-[3px]">
              <i-feather
                class="text-base-content/70"
                name="x-circle"
              ></i-feather>
              close
            </label>
          </ul>
        </div>
      </div>
    </Modal>
  `,
})
export class ParticipantsComponent {
  roleId = -1;

  selectRole(id: number) {
    this.roleId = id;
  }
}
