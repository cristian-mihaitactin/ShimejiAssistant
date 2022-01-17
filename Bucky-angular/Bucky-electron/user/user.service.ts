import { UserStore } from "helpers/user-store";
import { UserModel } from "./models/user-model";
import { environment } from "../environments/environment";
import { BehaviorSubject, catchError, throwError } from "rxjs";

export class UserService{
    
    private userEndpoint = '/api/User'

    public user: BehaviorSubject<UserModel>;

    constructor(private userStore:UserStore){
        this.user = new BehaviorSubject<UserModel>({
            username: userStore.get('username'), email: userStore.get('email')
        });

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
}