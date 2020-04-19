import React, { useState } from 'react';
// import 'normalize.css';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Folder from './Folder';
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

    if (type === 'folder') {
      const start = data.folderColumns[source.droppableId];
      const finish = data.folderColumns[destination.droppableId];

      if (start === finish) {
        const newFolderIds = Array.from(start.folderIds);
        newFolderIds.splice(source.index, 1);
        newFolderIds.splice(destination.index, 0, draggableId);

        const newFolderColumn = {
          ...start,
          folderIds: newFolderIds,
        };

        const newState = {
          ...data,
          folderColumns: {
            ...data.folderColumns,
            [newFolderColumn.id]: newFolderColumn,
          },
        };
        setData(newState);
        return;
      }

      // Moving from one list to another
      const startFolderIds = Array.from(start.folderIds);
      startFolderIds.splice(source.index, 1);
      const newStart = {
        ...start,
        folderIds: startFolderIds,
      };

      const finishFolderIds = Array.from(finish.folderIds);
      finishFolderIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        folderIds: finishFolderIds,
      };

      const newState = {
        ...data,
        folderColumns: {
          ...data.folderColumns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      setData(newState);
      return;
    }

    const start = data.folders[source.droppableId];
    const finish = data.folders[destination.droppableId];

    if (start === finish) {
      const newUrlIds = Array.from(start.urlIds);
      newUrlIds.splice(source.index, 1);
      newUrlIds.splice(destination.index, 0, draggableId);

      const newFolder = {
        ...start,
        urlIds: newUrlIds,
      };

      const newState = {
        ...data,
        folders: { ...data.folders, [newFolder.id]: newFolder },
      };

      setData(newState);
      return;
    }

    // Moving from one list to another
    const startUrlIds = Array.from(start.urlIds);
    startUrlIds.splice(source.index, 1);
    const newStart = {
      ...start,
      urlIds: startUrlIds,
    };

    const finishUrlIds = Array.from(finish.urlIds);
    finishUrlIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      urlIds: finishUrlIds,
    };

    const newState = {
      ...data,
      folders: {
        ...data.folders,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <FolderList droppableId="folder-column-1" data={data} />
        <FolderList droppableId="folder-column-2" data={data} />
      </Container>
    </DragDropContext>
  );
};

export default DnD;
