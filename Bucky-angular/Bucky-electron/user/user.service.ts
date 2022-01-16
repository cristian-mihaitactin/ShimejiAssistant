import { UserStore } from "helpers/user-store";
import { UserModel } from "./models/user-model";

export class UserService{
    constructor(private userStore:UserStore){
    }

    userIsLoggedIn():boolean {
        var authtokens = this.userStore.get('auth-tokens');
        return !(authtokens === undefined || authtokens === null);
    }

    getCurrentUser() {
        var user:UserModel = {
            username: this.userStore.get('username'),
            email: this.userStore.get('email'),
        }

        return user;
    }
}