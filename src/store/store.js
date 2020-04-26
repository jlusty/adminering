import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dndReducer from '../DragNDrop/dndSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    dnd: dndReducer,
  },
});
