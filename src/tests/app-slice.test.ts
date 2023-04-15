import {appActions, appReducer} from "src/app/app-slice";


describe('app slice', () => {
    let state: any;

    beforeEach(() => {
        state = {
            isInitialized: false,
            isFetching: false,
            errorMessageWhenFetching: null,
        };
    });

    it('should handle changeInitialized', () => {
        const newState = appReducer(state, appActions.changeInitialized({ value: true }));
        expect(newState.isInitialized).toBe(true);
    });

    it('should handle changeIsFetching', () => {
        const newState = appReducer(state, appActions.changeIsFetching({ isFetching: true }));
        expect(newState.isFetching).toBe(true);
    });

    it('should handle changeErrorMessage', () => {
        const newState = appReducer(state, appActions.changeErrorMessage({ value: 'Error message' }));
        expect(newState.errorMessageWhenFetching).toBe('Error message');
    });
});