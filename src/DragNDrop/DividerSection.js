import React from 'react';
import styled from 'styled-components';
import './DraggableUrl.css';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};

  display: flex;
  flex-direction: row;
`;

const DividerSection = ({ urlObj, index }) => {
  return (
    <Draggable draggableId={urlObj.id} index={index} isDragDisabled={true}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          Hi
        </Container>
      )}
    </Draggable>
  );
};

export default DividerSection;
