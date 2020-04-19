import React, { useState } from 'react';
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
const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const MinimiseBtn = styled.div`
  height: 30px;
  width: 30px;
  background-color: green;
`;
const UrlList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
  min-height: 30px;
`;

const Folder = ({ folder, urls, index }) => {
  const [isMinimised, setMinimised] = useState(false);

  return (
    <Draggable draggableId={folder.id} index={index}>
      {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <TitleBar>
            <Title {...provided.dragHandleProps}>{folder.title}</Title>
            <MinimiseBtn onClick={() => setMinimised(!isMinimised)} />
          </TitleBar>
          <Droppable droppableId={folder.id} type="url">
            {(provided, snapshot) =>
              isMinimised ? (
                <div ref={provided.innerRef}></div>
              ) : (
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
              )
            }
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Folder;
