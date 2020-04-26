import { createSlice } from '@reduxjs/toolkit';
import initialData from './initial-data';

export const dndSlice = createSlice({
  name: 'dnd',
  initialState: initialData,
  reducers: {
    setMinimised: (state, action) => {
      state.folders[action.payload].isMinimised = !state.folders[action.payload]
        .isMinimised;
    },
    changeFolderTitle: (state, action) => {
      const { folderId, newTitle } = action.payload;
      state.folders[folderId].title = newTitle;
    },
    setEditingTitle: (state, action) => {
      state.folders[action.payload].isEditingTitle = !state.folders[
        action.payload
      ].isEditingTitle;
    },
  },
});

export const {
  setMinimised,
  setEditingTitle,
  changeFolderTitle,
} = dndSlice.actions;

export default dndSlice.reducer;
