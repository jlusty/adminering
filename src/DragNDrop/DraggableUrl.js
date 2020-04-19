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

const DraggableUrl = ({ urlObj, index }) => {
  return (
    <Draggable draggableId={urlObj.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
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
        </Container>
      )}
    </Draggable>
  );
};

export default DraggableUrl;