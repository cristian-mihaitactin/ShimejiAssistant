import { UserStore } from "helpers/user-store";
import { UserModel } from "./models/user-model";

export class UserService{
    private userStore: UserStore;
    user: UserModel;

    constructor(userStore:UserStore){
        this.userStore = userStore;

        this.user = {
            username: userStore.get('username'),
            email: userStore.get('email')
        }
        
    }
}