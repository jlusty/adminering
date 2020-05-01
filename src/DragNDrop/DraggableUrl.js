import React from 'react';
import styled from 'styled-components';
import './DraggableUrl.css';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};

  display: flex;
  flex-direction: row;
`;
const FaviconContainer = styled.div`
  margin: 2px 8px 2px 2px;
`;
const ImgCentreHelper = styled.div`
  position: relative;
  height: 100%;
  width: 20px;
`;
const UrlText = styled.p`
  margin: 0px;
  font-size: 12px;
`;
const Spacer = styled.div`
  flex-grow: 1;
`;
const DeleteBtn = styled.div`
  height: 10px;
  width: 10px;
  border: 5px solid lightgrey;
`;

const DraggableUrl = ({ urlObj, index, style, removeUrlOrDividerAtIndex }) => {
  return (
    <Draggable draggableId={urlObj.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {UrlItem(urlObj, index, style, removeUrlOrDividerAtIndex)}
        </div>
      )}
    </Draggable>
  );
};

export const UrlItem = (urlObj, index, style, removeUrlOrDividerAtIndex) => (
  <Container style={style}>
    <FaviconContainer>
      <ImgCentreHelper>
        <img
          className="faviconImg"
          alt="Website favicon"
          height="16"
          width="16"
          src={`http://www.google.com/s2/favicons?domain=${urlObj.url}`}
        />
      </ImgCentreHelper>
    </FaviconContainer>
    <UrlText>
      <a href={urlObj.url}>{urlObj.description}</a>
      {urlObj.siteName ? (
        <>
          <br />
          {urlObj.siteName}
        </>
      ) : (
        <></>
      )}
    </UrlText>
    <Spacer />
    <DeleteBtn onClick={() => removeUrlOrDividerAtIndex(index)}>x</DeleteBtn>
  </Container>
);

export default DraggableUrl;
