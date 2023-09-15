import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,

} from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { filter, map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/collection';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { toObservable } from '@angular/core/rxjs-interop';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'participant-card',
  standalone: true,
  imports: [FeatherModule, CommonModule, ImgFallbackModule],
  template: `
    <div
      onclick="participantDetail.showModal()"
      class="flex w-full cursor-pointer items-center justify-between rounded-[3px] hover:bg-base-200"
    >
      <div class="flex items-center gap-2 p-2">
        <div class="flex aspect-square items-center gap-2 rounded-full ">
          <div class="avatar">
            <div class="w-[40px] rounded-full">
              <img
                [src]="userAvatarUrl$ | async"
                src-fallback="{{ fallbackAvatar }}"
              />
            </div>
          </div>
        </div>

        <div class="flex w-full flex-col">
          <a
            class=" w-fit p-0 text-base font-normal capitalize text-base-content no-underline sm1:text-[18px]"
          >
            {{ user.name }}
          </a>
          <p class="text-base text-base-content/70">{{ user.projectRole }}</p>
        </div>
      </div>
    </div>
  `,
})
export class ParticipantCardComponent implements OnInit {
  @Input() user: User & { projectRole: string | null } = {
    name: '',
    role_id: -1,
    uid: '',
    avatar_last_update: 0,
    projectRole: '',
  };

  authService = inject(AuthService);
  userUid = signal('');
  user$ = toObservable(this.userUid).pipe(
    filter(v => !!v),
    tap(v => console.log("uid!!:", v)),
    switchMap((uid) => this.authService.getUserProfile(uid))
  );
  fallbackAvatar = `https://api.multiavatar.com/${
    this.user.name || 'unnamed'
  }.png`;
  userAvatarUrl$ = this.user$.pipe(
    tap(v => console.log("user!!:", v)),
    map((user) => {
      const { avatar_last_update, avatar } = user;
      const time = avatar_last_update;

      if (time === null) {
        return avatar;
      }
      const base = avatar.slice(0, avatar.indexOf('.png'));
      const newUrl = `${base}-t-${time}.png`;

      return newUrl;
    })
  );

  ngOnInit(): void {
       this.fallbackAvatar = `https://api.multiavatar.com/${
      this.user.name || 'unnamed'
    }.png`;

    this.userUid.set(this.user.uid);
  }
}
