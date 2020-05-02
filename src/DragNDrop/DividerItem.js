import React from 'react';
import styled from 'styled-components';
import './DraggableUrl.css';
import {
  Container,
  TextCentreHelper,
  UrlText,
  Spacer,
  DeleteBtn,
} from './UrlItem';

const DividerContainer = styled(Container)`
  border: 0px;
  background-color: inherit;
`;
const DividerText = styled(UrlText)`
  margin-left: 20px;
  font-size: 14px;
`;

export const DividerItem = (urlObj, dividerItemDragState, deleteItem) => (
  <DividerContainer>
    <TextCentreHelper>
      <DividerText>Section #{urlObj.groupNum}</DividerText>
      <Spacer />
      <DeleteBtn
        deleteItem={deleteItem}
        isDragging={dividerItemDragState === 'isDraggingOver'}
      />
    </TextCentreHelper>
  </DividerContainer>
);
