import { createSlice } from '@reduxjs/toolkit';
import initialData from './initial-data';
import { addNewFolder } from './DnD';

export const dndSlice = createSlice({
  name: 'dnd',
  initialState: initialData,
  reducers: {
    toggleMinimised: (state, action) => {
      state.folders[action.payload].isMinimised = !state.folders[action.payload]
        .isMinimised;
    },
    setNotMinimised: (state, action) => {
      state.folders[action.payload].isMinimised = false;
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
    addFolderToRedux: (state, action) => {
      const { folderColumnId, newFolder } = action.payload;
      state.folders[newFolder.id] = newFolder;
      state.folders[newFolder.id].isMinimised = true;
      state = addNewFolder(state, folderColumnId, newFolder);
      console.log('reduxdone');
    },
  },
});

export const {
  toggleMinimised,
  setNotMinimised,
  setEditingTitle,
  changeFolderTitle,
  addFolderToRedux,
} = dndSlice.actions;

export default dndSlice.reducer;
