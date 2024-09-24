import { Component } from '@angular/core';

import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {Place} from "../../model/place.entity";
import { FormsModule, NgForm } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-restaurant-create-and-edit',
  standalone: true,
  imports: [MatFormField, MatInputModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './restaurant-create-and-edit.component.html',
  styleUrl: './restaurant-create-and-edit.component.css'
})
export class RestaurantCreateAndEditComponent {

  // Attributes
  @Input() place: Place;
  @Input() editMode: boolean = false;
  @Output() PlaceAdded: EventEmitter<Place> = new EventEmitter<Place>();
  @Output() PlaceUpdated: EventEmitter<Place> = new EventEmitter<Place>();
  @Output() editCanceled: EventEmitter<any> = new EventEmitter();
  @ViewChild('PlaceForm', {static: false}) PlaceForm!: NgForm;

  // Methods
  constructor() {
    this.place = {} as Place;
  }

  // Private methods
  private resetEditState(): void {
    this.place = {} as Place;
    this.editMode = false;
    this.PlaceForm.resetForm();
  }

  // Event Handlers

  onSubmit(): void {
    if (this.PlaceForm.form.valid) {
      let emitter: EventEmitter<Place> = this.editMode ? this.PlaceUpdated : this.PlaceAdded;
      emitter.emit(this.place);
      this.resetEditState();
    } else {
      console.error('Invalid data in form');
    }
  }

  onCancel(): void {
    this.editCanceled.emit();
    this.resetEditState();
  }

}
