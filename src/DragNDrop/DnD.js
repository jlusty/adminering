import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import FolderList from './FolderList';
import {
  setNotMinimised,
  addFolderToRedux,
  startDrag,
  endDrag,
} from './dndSlice';

const WholePageContainer = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  height: 100%;
  margin: 20px 20px;

  display: flex;
  flex-direction: row;
`;
const SaveBtn = styled.div`
  margin-left: 50px;
  padding: 10px 20px;
  background-color: lightgrey;
  width: 60px;
  height: 30px;
`;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function addNewFolder(data, folderColumnId, newFolder) {
  const newFolderIds = Array.from(data.folderColumns[folderColumnId].folderIds);
  newFolderIds.push(newFolder.id);

  const newFolderColumn = {
    ...data.folderColumns[folderColumnId],
    folderIds: newFolderIds,
  };

  return {
    ...data,
    folders: { ...data.folders, [newFolder.id]: newFolder },
    folderColumns: {
      ...data.folderColumns,
      [folderColumnId]: newFolderColumn,
    },
  };
}

const DnD = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const initialData = localStorage.getItem('current-data');
    if (initialData) {
      setData(JSON.parse(initialData));
    }
  }, []);

  const removeUrlOrDivider = (folderId, urlIndex) => {
    const newItemIds = Array.from(data.folders[folderId].urlIds);
    const urlsRemoved = newItemIds.splice(urlIndex, 1);
    const urlIdRemoved = urlsRemoved[0];

    const newFolder = {
      ...data.folders[folderId],
      urlIds: newItemIds,
    };
    const { [urlIdRemoved]: omit, ...newUrls } = data.urls;
    const newState = {
      ...data,
      urls: newUrls,
      folders: { ...data.folders, [folderId]: newFolder },
    };
    setData(newState);
  };

  const addFolder = folderColumnId => {
    const newFolder = { id: uuidv4(), title: 'New folder', urlIds: [] };
    dispatch(addFolderToRedux({ folderColumnId, newFolder }));
    const newState = addNewFolder(data, folderColumnId, newFolder);
    setData(newState);
  };

  const onDragStart = () => {
    dispatch(startDrag());
  };

  const onDragEnd = result => {
    dispatch(endDrag());
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    function moveItem(parentType, childIds) {
      const start = data[parentType][source.droppableId];
      const finish = data[parentType][destination.droppableId];

      if (start === finish) {
        const newItemIds = Array.from(start[childIds]);
        newItemIds.splice(source.index, 1);
        newItemIds.splice(destination.index, 0, draggableId);

        const newItem = {
          ...start,
          [childIds]: newItemIds,
        };

        const newState = {
          ...data,
          [parentType]: { ...data[parentType], [newItem.id]: newItem },
        };
        setData(newState);
        return;
      }

      // Moving from one list to another
      const startItemIds = Array.from(start[childIds]);
      startItemIds.splice(source.index, 1);
      const newStart = {
        ...start,
        [childIds]: startItemIds,
      };

      const finishItemIds = Array.from(finish[childIds]);
      finishItemIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        [childIds]: finishItemIds,
      };

      const newState = {
        ...data,
        [parentType]: {
          ...data[parentType],
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      setData(newState);

      // If drop into a minimised folder, expand it
      if (type === 'url') {
        dispatch(setNotMinimised(destination.droppableId));
      }
      return;
    }

    if (type === 'folder') {
      moveItem('folderColumns', 'folderIds');
      return;
    }
    moveItem('folders', 'urlIds');
  };

  const { folderColumnsOrder } = data;

  return (
    <WholePageContainer>
      <SaveBtn
        onClick={() => {
          saveState(data);
        }}
      >
        Save
      </SaveBtn>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Container>
          {folderColumnsOrder.map(folderColumnId => {
            const folderColumn = data.folderColumns[folderColumnId];
            return (
              <InnerList
                key={folderColumn.id}
                folderColumn={folderColumn}
                allFolders={data.folders}
                allUrls={data.urls}
                removeUrlOrDivider={removeUrlOrDivider}
                addFolder={addFolder}
              />
            );
          })}
        </Container>
      </DragDropContext>
    </WholePageContainer>
  );
};

const InnerList = React.memo(
  ({ folderColumn, allFolders, allUrls, ...props }) => {
    const folders = folderColumn.folderIds.map(
      folderId => allFolders[folderId]
    );
    return (
      <FolderList
        folderColumn={folderColumn}
        folders={folders}
        allUrls={allUrls}
        {...props}
      />
    );
  }
);

const saveState = data => {
  localStorage.setItem('current-data', JSON.stringify(data));
};

export default DnD;
