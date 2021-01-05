import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import User from '@/models/User';
import { StoreMutations } from '@/dependencies';
import _store, { _StoreMutations } from '@/dependencies/_store';

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

    setAccessToken(token: string) {
        _store.commit(_StoreMutations.SET_ACCESS_TOKEN, token);
    }

    setRefreshToken(token: string) {
        _store.commit(_StoreMutations.SET_REFRESH_TOKEN, token);
    }

    getAccessToken(): string {
        return _store.getters.accessToken;
    }

    getRefreshToken(): string {
        return _store.getters.refreshToken;
    }
}
