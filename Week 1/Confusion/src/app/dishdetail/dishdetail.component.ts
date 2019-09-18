import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Dish } from '../Shared/Dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../Shared/Comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  validationMessages = {
    firstname: {
      required:      'First Name is required.',
      minlength:     'First Name must be at least 2 characters long.',
      maxlength:     'FirstName cannot be more than 25 characters long.'
    },
    lastname: {
      required:      'Last Name is required.',
      minlength:     'Last Name must be at least 2 characters long.',
      maxlength:     'Last Name cannot be more than 25 characters long.'
    },
    telnum: {
      required:      'Tel. number is required.',
      pattern:       'Tel. number must contain only numbers.'
    },
    email: {
      required:      'Email is required.',
      email:         'Email not in valid format.'
    },
  };
  @ViewChild('fform', {static: false}) CommentFormDirective;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    // tslint:disable-next-line: no-string-literal
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

}
