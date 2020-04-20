import React, { useState } from 'react';
// import 'normalize.css';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import FolderList from './FolderList';

const Container = styled.div`
  margin: 20px 20px;

  display: flex;
  flex-direction: row;
`;

const DnD = () => {
  const [data, setData] = useState(initialData);

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
            />
          );
        })}
      </Container>
    </DragDropContext>
  );
};

const InnerList = React.memo(({ folderColumn, allFolders, allUrls }) => {
  const folders = folderColumn.folderIds.map(folderId => allFolders[folderId]);
  return (
    <FolderList
      folderColumn={folderColumn}
      folders={folders}
      allUrls={allUrls}
    />
  );
});

export default DnD;
