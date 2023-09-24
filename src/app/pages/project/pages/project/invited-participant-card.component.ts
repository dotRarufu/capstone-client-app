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
import getRoleName from 'src/app/utils/getRoleName';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'invited-participant-card',
  standalone: true,
  imports: [FeatherModule, CommonModule, ImgFallbackModule],
  template: `
    <div
      onclick="invitedParticipantDetail.showModal()"
      class="flex w-full cursor-pointer items-center justify-between rounded-[3px] hover:bg-base-200"
    >
      <div class="flex items-center gap-2 p-2 ">
        <div class="aspect-square rounded-full flex items-center">
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
          <p class="text-base text-base-content/70">
            {{ getRoleName(user.role) }} (Pending)
          </p>
        </div>
      </div>
    </div>
  `,
})
export class InvitedParticipantCardComponent implements OnInit {
  @Input() user: User & {
    created_at: string;
    id: number;
    is_accepted: boolean;
    project_id: number;
    receiver_uid: string;
    role: number;
    sender_uid: string;
  } = {
    name: '',
    role_id: -1,
    uid: '',
    avatar_last_update: 0,
    created_at: '',
    id: -1,
    is_accepted: false,
    project_id: -1,
    receiver_uid: '',
    role: -1,
    sender_uid: '',
  };

  authService = inject(AuthService);
  userUid = signal('');
  user$ = toObservable(this.userUid).pipe(
    filter(v => !!v),
    switchMap((uid) => this.authService.getUserProfile(uid))
  );
  fallbackAvatar = `https://api.multiavatar.com/${
    this.user.name || 'Unnamed'
  }.png`;
  userAvatarUrl$ = this.user$.pipe(
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

  getRoleName(id: number) {
    return getRoleName(id);
  }
}
