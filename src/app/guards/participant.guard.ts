import {
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { inject } from '@angular/core';
import { catchError, from, map, of, switchMap} from 'rxjs';

export const participantGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const projectService = inject(ProjectService);
  const router = inject(Router);

  const child1 = route.firstChild;

  if (child1 === null) throw new Error('1 shoudl be impossible');

  const projectId = Number(child1.url[0].path);

  const currentUser = authService.getCurrentUser();

//todo:   refactor
  if (currentUser !== null) {
    console.log('currentuser is null');
    const currentUserPArticipant$ = projectService
      .checkProjectParticipant(currentUser.uid, projectId)
      .pipe(
        map((dec) => {
          if (!dec) {
            console.log(
              'user is not a participant, and repelled by the guard:'
            );
            //   todo: navigate to unauthorized
            router.navigate(['/']);
          }

          return dec;
        }),
        catchError((err) => {
          console.log('error occured:', err);

          router.navigate(['/']);
          return of(false);
        })
      );

    return currentUserPArticipant$;
  }

  const authenticatedUser = authService.getAuthenticatedUser();
  const authenticatedUser$ = from(authenticatedUser).pipe(
    map((res) => {
      if (res === null) throw new Error('no authenticated user');

      return res;
    }),

    switchMap((user) =>
      projectService.checkProjectParticipant(user.id, projectId)
    ),
    map((dec) => {
      if (!dec) {
        console.log('user is not a participant, and repelled by the guard:');
        //   todo: navigate to unauthorized
        router.navigate(['/']);
      }

      return dec;
    }),
    catchError((err) => {
      console.log('error occured:', err);

      router.navigate(['/']);
      return of(false);
    })
  );

  return authenticatedUser$;
};
