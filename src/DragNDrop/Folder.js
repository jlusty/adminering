import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import DraggableUrl from './DraggableUrl';
import DividerSection from './DividerSection';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  border-radius: 2px;
  width: 300px;

  display: flex;
  flex-direction: column;
`;
const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const TitleText = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const TitleInput = styled.input`
  width: 200px;
  margin: 0px;
  padding: 8px;
`;
const MinimiseBtn = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 5px solid white;
  background-color: ${props => (props.isMinimised ? 'pink' : 'lightgrey')};
`;
const EditBtn = styled.div`
  height: 25px;
  width: 25px;
  border: 5px solid white;
  background-color: ${props => (props.isEditingTitle ? 'purple' : 'lightgrey')};
`;
const BtnBox = styled.div`
  width: 70px;
  display: flex;
  flex-direction: row;
`;
const UrlList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
  min-height: 30px;
`;

const InnerList = React.memo(({ urls, isMinimised }) => {
  if (isMinimised) {
    return <></>;
  }
  return urls.map((urlObj, index) => (
    <UrlOrDivider
      key={urlObj.id}
      type={urlObj.type}
      urlObj={urlObj}
      index={index}
    />
  ));
});

const UrlOrDivider = ({ type, urlObj, index }) => {
  if (type === 'url') {
    return <DraggableUrl urlObj={urlObj} index={index} />;
  } else {
    return <DividerSection urlObj={urlObj} index={index} />;
  }
};

const Title = ({ text, isEditingTitle }) => {
  const [titleText, setTitleText] = useState(text);

  return isEditingTitle ? (
    <TitleInput
      type="text"
      value={titleText}
      onChange={e => {
        setTitleText(e.target.value);
      }}
    ></TitleInput>
  ) : (
    <TitleText>{titleText}</TitleText>
  );
};

const Folder = ({ folder, urls, index }) => {
  const [isMinimised, setMinimised] = useState(true);
  const [isEditingTitle, setEditingTitle] = useState(false);

  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <TitleBar {...provided.dragHandleProps}>
            <Title text={folder.title} isEditingTitle={isEditingTitle} />
            <BtnBox>
              <EditBtn
                onClick={() => setEditingTitle(!isEditingTitle)}
                isEditingTitle={isEditingTitle}
              />
              <MinimiseBtn
                onClick={() => setMinimised(!isMinimised)}
                isMinimised={isMinimised}
              />
            </BtnBox>
          </TitleBar>
          <Droppable droppableId={folder.id} type="url">
            {(provided, snapshot) => (
              <UrlList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList urls={urls} isMinimised={isMinimised} />
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
