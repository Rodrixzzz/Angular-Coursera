import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import {Dish} from '../Shared/Dish';
import { DishService } from '../services/dish.service';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private DishService: DishService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    // tslint:disable-next-line: no-string-literal
    const id = this.route.snapshot.params['id'];
    this.dish = this.DishService.getDish(id);
  }

  goBack(): void {
    this.location.back();
  }

}
