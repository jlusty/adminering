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
const DividerText = styled.p`
  margin: 0px;
  font-size: 12px;
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
          <DividerText>Section #{urlObj.groupNum}</DividerText>
        </Container>
      )}
    </Draggable>
  );
};

export default DividerSection;
