import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { inject } from '@angular/core';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';

export const participantGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const projectService = inject(ProjectService);
  const router = inject(Router);

  const child1 = route.firstChild;

  if (child1 === null) throw new Error('1 shoudl be impossible');

  const projectId = Number(child1.url[0].path);

  //todo:   refactor

  const authenticatedUser$ = authService.getAuthenticatedUser().pipe(
    map((res) => {
      if (res === null) throw new Error('no authenticated user');

      return res;
    }),
    switchMap((user) =>
      projectService.checkProjectParticipant(user.uid, projectId)
    ),
    map((dec) => {
      if (!dec) {
        console.log('user is not a participant, and repelled by the guard:');
        router.navigate(['/', 'unauthorized']);
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
