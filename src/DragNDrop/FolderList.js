import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Folder from './Folder';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  height: 70vh;
  min-width: 318px;
`;
const InnerContainer = styled.div`
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  border-radius: 2px;
  width: 100%;
  min-height: 100px;

  display: flex;
  flex-direction: ${props =>
    props.direction === 'horizontal' ? 'row' : 'column'};
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;

const InnerList = React.memo(({ folder, urlMap, index }) => {
  const urls = folder.urlIds.map(urlId => urlMap[urlId]);
  return <Folder folder={folder} urls={urls} index={index} />;
});

const FolderList = ({ folderColumn, folders, allUrls }) => {
  return (
    <Container>
      <Title>{folderColumn.id}</Title>
      <Droppable
        droppableId={folderColumn.id}
        direction={folderColumn.direction}
        type="folder"
      >
        {(provided, snapshot) => (
          <InnerContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
            direction={folderColumn.direction}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {folders.map((folder, index) => {
              return (
                <InnerList
                  key={folder.id}
                  folder={folder}
                  urlMap={allUrls}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </InnerContainer>
        )}
      </Droppable>
    </Container>
  );
};

export default FolderList;
