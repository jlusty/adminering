import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Folder from './Folder';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 300px;
  min-height: 100px;

  display: flex;
  flex-direction: ${props =>
    props.direction === 'horizontal' ? 'row' : 'column'};
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;

const FolderList = ({ folderColumn, folders, allUrls }) => {
  return (
    <Container>
      <Title>{folderColumn.id}</Title>
      <Droppable
        droppableId={folderColumn.id}
        direction={folderColumn.direction}
        type="folder"
      >
        {provided => (
          <Container
            {...provided.droppableProps}
            ref={provided.innerRef}
            direction={folderColumn.direction}
          >
            {folders.map((folder, index) => {
              const urls = folder.urlIds.map(urlId => allUrls[urlId]);

              return (
                <Folder
                  key={folder.id}
                  folder={folder}
                  urls={urls}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </Container>
  );
};

export default FolderList;
