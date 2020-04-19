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

  display: flex;
  flex-direction: row;
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const ItemList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
  min-height: 30px;
`;

const FolderList = ({ droppableId, data }) => {
  return (
    <Container>
      <Title>{droppableId}</Title>
      <Droppable droppableId={droppableId} direction="horizontal" type="folder">
        {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {data['folderColumns'][droppableId].folderIds.map(
              (folderId, index) => {
                const folder = data.folders[folderId];
                const urls = folder.urlIds.map(urlId => data.urls[urlId]);

                return (
                  <Folder
                    key={folder.id}
                    folder={folder}
                    urls={urls}
                    index={index}
                  />
                );
              }
            )}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </Container>
  );
};

export default FolderList;
