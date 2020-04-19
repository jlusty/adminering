import React, { useState } from 'react';
// import 'normalize.css';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Folder from './Folder';

const Container = styled.div`
  display: flex;
  margin: 20px 20px;
`;

const DnD = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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
        {data.folderOrder.map(folderId => {
          const folder = data.folders[folderId];
          const urls = folder.urlIds.map(urlId => data.urls[urlId]);

          return <Folder key={folder.id} folder={folder} urls={urls} />;
        })}
      </Container>
    </DragDropContext>
  );
};

export default DnD;
