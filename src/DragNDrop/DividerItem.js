import React from 'react';
import styled from 'styled-components';
import './DraggableUrl.css';

const Container = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};

  display: flex;
  flex-direction: row;
`;
const DividerText = styled.p`
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

export const DividerItem = (urlObj, deleteItem) => (
  <Container>
    <DividerText>Section #{urlObj.groupNum}</DividerText>
    <Spacer />
    <DeleteBtn onClick={deleteItem}>x</DeleteBtn>
  </Container>
);
