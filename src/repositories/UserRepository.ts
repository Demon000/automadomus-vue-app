import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import User from '@/models/User';
import { StoreMutations } from '@/dependencies';

export default class UserRepository {
    private _store: Store<StoreState>;

    constructor(store: Store<StoreState>) {
        this._store = store;
    }

    setLoggedInUser(user: User | undefined): void {
        this._store.commit(StoreMutations.SET_LOGGED_IN_USER, user);
    }

    getLoggedInUser(): User {
        return this._store.getters.loggedInUser;
    }
}
