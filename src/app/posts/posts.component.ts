import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
 
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [PostsService]
})
export class PostsComponent implements OnInit {
  posts: any = []
  //using this typescript we are getting all definition of service into the variable
  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(posts=>{
      this.posts = posts
    })
  }

}
