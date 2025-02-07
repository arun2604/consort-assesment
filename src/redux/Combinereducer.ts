import { combineReducers } from 'redux';
import taskSlice from './slice/TaskSlice';
import locationSlice from './slice/locationSlice';

export default combineReducers({
    task: taskSlice,
    location: locationSlice
});
