import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

export interface ExerciseId extends Exercise { id: string; }

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  availableExercicesChanged = new Subject<any[]>();
  exerciseSubscription: Subscription;
  isloading = true;
  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.exercises = exercises;
        this.isloading = false;
      }
    );
    this.fetchExercises();
  }


  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
  }
  
  fetchExercises(){
    this.trainingService.fetchAvailableExercises();
  }
}
