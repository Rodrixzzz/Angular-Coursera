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
    author: {
      required:      'Author is required.',
      minlength:     'Author must be at least 2 characters long.',
      maxlength:     'Author cannot be more than 25 characters long.'
    },
    comment: {
      required:      'Comment is required.',
      minlength:     'Comment must be at least 2 characters long.',
      maxlength:     'Comment cannot be more than 50 characters long.'
    },
    rating: {
      required:      'Rating is required.',
      pattern:       'Rating must contain only numbers.',
      max:           'Rating value must be lower or equal than 5',
      min:           'Rating value must be greater than 0'
    },
    date: {
      required:      'Date is required.'
    },
  };
  formErrors = {
    author: '',
    comment: '',
    rating: '',
    date: ''
  };
  @ViewChild('fform', {static: false}) CommentFormDirective;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) {
                this.CreateForm();
              }

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
  CreateForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      rating: ['', [Validators.required, Validators.pattern, Validators.max(5), Validators.min(1)] ],
      date: [Date.now().toString(), [Validators.required] ],
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {

  }

}
