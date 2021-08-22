import { createSlice } from '@reduxjs/toolkit';
import initialData from './initial-data';
import { addNewFolder } from './DnD';

export const dndSlice = createSlice({
  name: 'dnd',
  initialState: {
    ...(localStorage.getItem('current-data')
      ? JSON.parse(localStorage.getItem('current-data'))
      : initialData),
    dragHappening: false,
  },
  reducers: {
    toggleMinimised: (state, action) => {
      const { folderId, parentDirection } = action.payload;
      if (parentDirection === 'horizontal') {
        state.folders[folderId].isMinimised =
          !state.folders[folderId].isMinimised;
      }
    },
    setNotMinimised: (state, action) => {
      state.folders[action.payload].isMinimised = false;
    },
    setMinimised: (state, action) => {
      state.folders[action.payload].isMinimised = true;
    },
    changeFolderTitle: (state, action) => {
      const { folderId, newTitle } = action.payload;
      state.folders[folderId].title = newTitle;
    },
    setEditingTitle: (state, action) => {
      state.folders[action.payload].isEditingTitle =
        !state.folders[action.payload].isEditingTitle;
    },
    addFolderToRedux: (state, action) => {
      const { folderColumnId, newFolder } = action.payload;
      state.folders[newFolder.id] = newFolder;
      state.folders[newFolder.id].isMinimised = true;
      state = addNewFolder(state, folderColumnId, newFolder);
    },
    startDrag: state => {
      state.dragHappening = true;
    },
    endDrag: state => {
      state.dragHappening = false;
    },
  },
});

export const {
  toggleMinimised,
  setNotMinimised,
  setMinimised,
  setEditingTitle,
  changeFolderTitle,
  addFolderToRedux,
  startDrag,
  endDrag,
} = dndSlice.actions;

export default dndSlice.reducer;
