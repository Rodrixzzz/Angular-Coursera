import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Dish } from '../Shared/Dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../Shared/Comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';

  validationMessages = {
    author: {
      required: 'Author is required.',
      minlength: 'Author must be at least 2 characters long.',
      maxlength: 'Author cannot be more than 25 characters long.'
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 2 characters long.',
      maxlength: 'Comment cannot be more than 50 characters long.'
    }
  };
  formErrors = {
    author: '',
    comment: '',
    rating: '',
    date: ''
  };
  @ViewChild('fform', { static: false }) CommentFormDirective;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') public BaseURL) {
    this.CreateForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = errmess as any);
    // tslint:disable-next-line: no-string-literal
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = errmess as any);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  CreateForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      rating: ['', []]
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
    this.comment = form.value;
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = errmess as any; });
    console.log(this.comment);
    this.comment = null;
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });

  }

}
