import React from 'react';
import styled from 'styled-components';
import './DraggableUrl.css';

export const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 8px;
  height: 52px;
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
const deleteBtnWidth = 10;
const deleteBtnBorderWidth = 3;
export const UrlText = styled.p`
  margin: 0px;
  font-size: 12px;
  width: calc(100% - ${deleteBtnWidth + 2 * deleteBtnBorderWidth + 3}px);
`;
export const TextCentreHelper = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
`;
export const Spacer = styled.div`
  flex-grow: 1;
`;
const DeleteBtnContainer = styled.div`
  height: 10px;
  width: ${deleteBtnWidth}px;
  border: ${deleteBtnBorderWidth}px solid lightgrey;
  border-radius: 25%;
  font-size: 11px;
  cursor: pointer;

  display: flex;
  align-items: center;
`;

export const UrlItem = (urlObj, urlItemDragState, deleteItem) => (
  <Container isDragging={urlItemDragState === 'isDragging'}>
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
    <TextCentreHelper>
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
      <DeleteBtn
        deleteItem={deleteItem}
        isDragging={
          urlItemDragState === 'isDragging' ||
          urlItemDragState === 'isDraggingOver'
        }
      />
    </TextCentreHelper>
  </Container>
);

export const DeleteBtn = ({ deleteItem, isDragging }) =>
  isDragging ? (
    <></>
  ) : (
    <DeleteBtnContainer onClick={deleteItem}>✖</DeleteBtnContainer>
  );
