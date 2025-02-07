import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import rootReducer from './Combinereducer.ts';

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: { warnAfter: 128 },
            serializableCheck: { warnAfter: 128 },
        }),
});

export default store;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;