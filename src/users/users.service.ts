import { Injectable } from '@nestjs/common';
import { User, Users } from './interfaces/user.interface';

//Providers 
@Injectable()
export class UsersService {
// Logic for user data
private readonly users: Users = {
    1: {
      id: 1,
      name: "Burger",
      username: "burger_599",
      password: "HelloFromBurger",
      avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    2: {
      id: 2,
      name: "Pizza",
      username: "pizza_599",
      password: "HelloFromPizza",
      avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    3: {
      id: 3,
      name: "Tea",
      username: "Tea_599",
      password: "HelloFromTea",
      avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    }
  };
  
  findAll(): Users {
    return this.users;
  }
}