import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor (private db: AngularFirestore,
    private uiService: UIService){}

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
    .collection('availableExcercises')
    .snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map(doc => {
          console.log(doc);
          return({
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories'],
          });
        });
      }))
      .subscribe(exercices => {
        this.availableExercises = exercices;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.showBar("Fetching failed", null, 3000);
        this.uiService.loadingStateChange.next(false);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
      this.addDataToDataBase({...this.runningExercise, date: new Date(), state: 'completed'});
      this.runningExercise = null;
      this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDataBase({...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompleteOrCancelledExercises(){
    
    this.fbSubs.push(this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          console.log(exercises);
          this.finishedExercisesChanged.next(exercises);
        }));
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDataBase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
