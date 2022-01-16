import { UserStore } from "helpers/user-store";
import { UserModel } from "./models/user-model";
import { environment } from "../environments/environment";

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
            email: this.userStore.get('email')
        }

        return user;
    }

    logout() {
        const defaultUser = environment.default_user;

        this.userStore.set('username',defaultUser.username);
        this.userStore.set('email', defaultUser.email);
        this.userStore.set('bucky_profile',defaultUser.bucky_profile);
    }
}