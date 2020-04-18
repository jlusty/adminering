import React, { useState } from 'react';
// import 'normalize.css';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './Column';

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

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newUrlIds = Array.from(start.urlIds);
      newUrlIds.splice(source.index, 1);
      newUrlIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        urlIds: newUrlIds,
      };

      const newState = {
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
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
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const urls = column.urlIds.map(urlId => data.urls[urlId]);

          return <Column key={column.id} column={column} urls={urls} />;
        })}
      </Container>
    </DragDropContext>
  );
};

export default DnD;
