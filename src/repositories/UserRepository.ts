import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import User from '@/models/User';
import { StoreMutations } from '@/dependencies';

export default class UserRepository {
    private store: Store<StoreState>;

    constructor(store: Store<StoreState>) {
        this.store = store;
    }

    setLoggedInUser(user: User | undefined): void {
        this.store.commit(StoreMutations.SET_LOGGED_IN_USER, user);
    }

    getLoggedInUser(): User {
        return this.store.getters.loggedInUser;
    }
}
