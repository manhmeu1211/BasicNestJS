import { Injectable } from '@nestjs/common';
import { User, Users } from './interfaces/user.interface';

//Providers 
@Injectable()
export class UsersService {
// Logic for user data
private readonly users: User[] = [
  {
    id: 1,
    name: "Burger",
    username: "burger_599",
    password: "HelloFromBurger",
    avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
  },
  {
    id: 2,
    name: "Pizza",
    username: "pizza_599",
    password: "HelloFromPizza",
    avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
  },
  {
    id: 3,
    name: "Tea",
    username: "Tea_599",
    password: "HelloFromTea",
    avatarUrl: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
  }
]
  
  findAll(): Users {
    return this.users;
  }

  findOne(id: number): User {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        return this.users[i]
      }
    }
    return null;
  }
}