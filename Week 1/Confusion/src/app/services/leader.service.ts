import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Leader } from '../Shared/Leader';
import { LEADERS } from '../Shared/Leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }
  getLeaders(): Observable<Leader[]> {
    return of(LEADERS).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader> {
    return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  }
}
