import { Component } from '@angular/core';

import { AfterViewInit, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import {PlacesService} from "../../services/places.service";
import {Place} from "../../model/place.entity";
import {RestaurantCreateAndEditComponent} from "../../components/restaurant-create-and-edit/restaurant-create-and-edit.component";
import { NgClass } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-restaurant-management',
  standalone: true,
  imports: [MatPaginator, MatSort, MatIconModule, RestaurantCreateAndEditComponent, MatTableModule, NgClass, TranslateModule, MatFormField, FormsModule, MatInput, MatCheckbox, MatButton],
  templateUrl: './restaurant-management.component.html',
  styleUrl: './restaurant-management.component.css'

})
export class RestaurantManagementComponent implements OnInit, AfterViewInit {

  // Attributes
  placeData: Place;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'address', 'cuisineType','rating', 'actions'];
  isEditMode: boolean;
  searchTerm: string = '';



  @ViewChild(MatPaginator, { static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false}) sort!: MatSort;

  // Constructor
  constructor(private placesService: PlacesService) {
    this.isEditMode = false;
    this.placeData = {} as Place;
    this.dataSource = new MatTableDataSource<any>();
  }

  // Private Methods
  private resetEditState(): void {
    this.isEditMode = false;
    this.placeData = {} as Place;
  }

  // CRUD Actions

  private getAllPlaces(): void {
    this.placesService.getAll()
      .subscribe((response: any) => {
        this.dataSource.data = response;
      });
  };

  private createPlace(): void {
    this.placesService.create(this.placeData)
      .subscribe((response: any) => {
        this.dataSource.data.push({...response});
        // Actualiza el dataSource.data con los students actuales, para que Angular detecte el cambio y actualice la vista.
        this.dataSource.data = this.dataSource.data
          .map((place: Place) => {
            return place;
          });
      });
  };

  private updatePlace(): void {
    let placeToUpdate: Place = this.placeData;
    this.placesService.update(this.placeData.id, placeToUpdate)
      .subscribe((response: any) => {
        this.dataSource.data = this.dataSource.data
          .map((place: Place) => {
            if (place.id === response.id) {
              return response;
            }
            return place;
          });
      });
  };

  private deletePlace(placeId: number): void {
    this.placesService.delete(placeId)
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data
          .filter((place: Place) => {
            return place.id !== placeId ? place : false;
          });
      });
  };

  // UI Event Handlers

  onEditItem(element: Place) {
    this.isEditMode = true;
    this.placeData = element;
  }

  onDeleteItem(element: Place) {
    this.deletePlace(element.id);
  }

  onCancelEdit() {
    this.resetEditState();
    this.getAllPlaces();
  }

  onPlaceAdded(element: Place) {
    this.placeData = element;
    this.createPlace();
    this.resetEditState();
  }

  onPlaceUpdated(element: Place) {
    this.placeData = element;
    this.updatePlace();
    this.resetEditState();
  }

  searchPlaces(): void {
    if (this.searchTerm) {
      this.dataSource.data = this.dataSource.data.filter((place: Place) =>
        place.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.getAllPlaces();
    }
  }

  sortPlaces(orderBy: string): void {
    // Clonamos el dataSource.data para evitar mutaciones directas
    const sortedData = this.dataSource.data.slice();

    if (orderBy === 'id') {
      sortedData.sort((a: Place, b: Place) => a.id - b.id);
    } else if (orderBy === 'name') {
      sortedData.sort((a: Place, b: Place) => a.name.localeCompare(b.name));
    }

    // Asignar el nuevo array ordenado a dataSource
    this.dataSource.data = sortedData;
  }

  // Lifecycle Hooks

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }



}
