import { Injectable } from '@angular/core';

import { BaseService } from "../../shared/services/base.service";
import { HttpClient } from "@angular/common/http";
import {Place} from "../model/place.entity";

@Injectable({
  providedIn: 'root'
})
export class PlacesService extends BaseService<Place>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/restaurants';
  }

}
