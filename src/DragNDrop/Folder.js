import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import DraggableUrl from './DraggableUrl';
import DividerSection from './DividerSection';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
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
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
  min-height: 300px;
`;

const Folder = ({ folder, urls, index }) => {
  return (
    <Draggable draggableId={folder.id} index={index}>
      {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{folder.title}</Title>
          <Droppable droppableId={folder.id} type="url">
            {(provided, snapshot) => (
              <UrlList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {urls.map((urlObj, index) => {
                  if (urlObj.type === 'url') {
                    return (
                      <DraggableUrl
                        key={urlObj.id}
                        urlObj={urlObj}
                        index={index}
                      />
                    );
                  } else if (urlObj.type === 'divider') {
                    return (
                      <DividerSection
                        key={urlObj.id}
                        urlObj={urlObj}
                        index={index}
                      />
                    );
                  }
                  return <></>;
                })}
                {provided.placeholder}
              </UrlList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Folder;
