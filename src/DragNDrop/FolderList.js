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
const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const BtnBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const AddBtn = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 25%;
  border: 5px solid white;
  background-color: lightgrey;
`;

const InnerList = React.memo(({ folder, urlMap, index, ...props }) => {
  const urls = folder.urlIds.map(urlId => urlMap[urlId]);
  return <Folder folder={folder} urls={urls} index={index} {...props} />;
});

const FolderList = ({
  folderColumn,
  folders,
  allUrls,
  addFolder,
  ...props
}) => {
  return (
    <Container>
      <TitleBar>
        <Title>{folderColumn.id}</Title>
        <BtnBox>
          <AddBtn onClick={() => addFolder(folderColumn.id)} />
        </BtnBox>
      </TitleBar>
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
                  {...props}
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
