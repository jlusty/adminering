import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import DraggableUrl from './DraggableUrl';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 300px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const UrlList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 300px;
`;

const Column = ({ column, urls }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <UrlList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {urls.map((urlObj, index) => (
              <DraggableUrl key={urlObj.id} urlObj={urlObj} index={index} />
            ))}
            {provided.placeholder}
          </UrlList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
