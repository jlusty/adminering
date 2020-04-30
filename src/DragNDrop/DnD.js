import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import FolderList from './FolderList';

const Container = styled.div`
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

const DnD = () => {
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

  const onDragEnd = result => {
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
    <>
      <SaveBtn
        onClick={() => {
          saveState(data);
        }}
      >
        Save
      </SaveBtn>
      <DragDropContext onDragEnd={onDragEnd}>
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
              />
            );
          })}
        </Container>
      </DragDropContext>
    </>
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
