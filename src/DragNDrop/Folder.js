import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FixedSizeList, areEqual } from 'react-window';
import { UrlItem } from './UrlItem';
import { DividerItem } from './DividerItem';
import {
  toggleMinimised,
  setEditingTitle,
  changeFolderTitle,
} from './dndSlice';
import './customScrollbar.css';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  border-radius: 2px;
  width: 300px;
  ${props => (props.isMinimised ? `height: ${titleBarHeight * 2}px;` : '')}
  flex-grow: ${props => (props.isMinimised ? '0' : '1')};

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const titleBarHeight = 37;
const btnBoxWidth = 70;
const TitleBar = styled.div`
  height: ${titleBarHeight}px;
  flex-grow: 1;
  ${props =>
    props.isEditingTitle ? `max-width: calc(100% - ${btnBoxWidth}px);` : ''};
`;
const TitleText = styled.h3`
  margin: 0px;
  padding: 8px;
`;
const titleInputPadding = 8;
const TitleInput = styled.input`
  margin: 0px;
  padding: ${titleInputPadding}px;
  width: 100%;
`;
const BtnBox = styled.div`
  width: ${btnBoxWidth}px;
  height: ${titleBarHeight}px;
  display: flex;
  flex-direction: row;
`;
const MinimiseBtn = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 5px solid ${props => (props.isDragging ? 'inherit' : 'white')};
  background-color: ${props => {
    if (props.isDragging) {
      return 'inherit';
    } else if (props.isMinimised) {
      return 'pink';
    }
    return 'lightgrey';
  }};
`;
const EditBtn = styled.div`
  height: 25px;
  width: 25px;
  border: 5px solid ${props => (props.isDragging ? 'inherit' : 'white')};
  background-color: ${props => {
    if (props.isDragging) {
      return 'inherit';
    } else if (props.isMinimised) {
      return 'purple';
    }
    return 'lightgrey';
  }};
`;
const urlListPadding = 8;
const UrlList = styled.div`
  width: 100%;
  height: ${props =>
    props.isMinimised
      ? '21px;'
      : `calc(100% - ${titleBarHeight + 2 * urlListPadding}px);`}
  min-height: ${titleBarHeight - 2 * urlListPadding}px;
  padding: ${urlListPadding}px 0px ${urlListPadding}px ${urlListPadding}px;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
`;

const Title = ({ folderId, isEditingTitle }) => {
  const dispatch = useDispatch();
  const titleText = useSelector(state => state.dnd.folders[folderId].title);

  return isEditingTitle ? (
    <TitleInput
      type="text"
      value={titleText}
      onChange={e => {
        dispatch(changeFolderTitle({ folderId, newTitle: e.target.value }));
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          dispatch(setEditingTitle(folderId));
        }
      }}
    ></TitleInput>
  ) : (
    <TitleText>{titleText}</TitleText>
  );
};

const Folder = ({
  folder,
  urls,
  index,
  removeUrlOrDivider,
  parentDirection,
}) => {
  const isMinimised = useSelector(
    state => state.dnd.folders[folder.id].isMinimised
  );
  const isEditingTitle = useSelector(
    state => state.dnd.folders[folder.id].isEditingTitle
  );
  const dispatch = useDispatch();

  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isMinimised={isMinimised}
        >
          <TitleBar
            {...provided.dragHandleProps}
            isEditingTitle={isEditingTitle}
          >
            <Title folderId={folder.id} isEditingTitle={isEditingTitle} />
          </TitleBar>
          <BtnBox>
            <EditBtn
              onClick={() => dispatch(setEditingTitle(folder.id))}
              isEditingTitle={isEditingTitle}
              isDragging={snapshot.isDragging}
            />
            <MinimiseBtn
              onClick={() =>
                dispatch(
                  toggleMinimised({ folderId: folder.id, parentDirection })
                )
              }
              isMinimised={isMinimised}
              isDragging={snapshot.isDragging}
            />
          </BtnBox>
          <ItemList
            isMinimised={isMinimised}
            folder={folder}
            urls={urls}
            removeUrlOrDivider={removeUrlOrDivider}
            parentDirection={parentDirection}
          />
        </Container>
      )}
    </Draggable>
  );
};

const ItemList = React.memo(
  ({ isMinimised, folder, urls, removeUrlOrDivider }) => (
    <Droppable
      droppableId={folder.id}
      type="url"
      mode="virtual"
      renderClone={(provided, snapshot, rubric) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {UrlItem(urls[rubric.source.index], true, () => {})}
        </div>
      )}
    >
      {(provided, snapshot) => {
        let itemCount = snapshot.isUsingPlaceholder
          ? urls.length + 1
          : urls.length;
        let height = 742;

        if (isMinimised) {
          itemCount = 0;
          height = 29;
        }

        return (
          <UrlList
            isDraggingOver={snapshot.isDraggingOver}
            isMinimised={isMinimised}
          >
            <FixedSizeList
              className="customScrollbar"
              width={292}
              height={height}
              itemCount={itemCount}
              itemSize={78}
              outerRef={provided.innerRef}
              itemData={{
                urls,
                deleteItemAtIndex: index =>
                  removeUrlOrDivider(folder.id, index),
              }}
            >
              {ItemRenderer}
            </FixedSizeList>
          </UrlList>
        );
      }}
    </Droppable>
  )
);

const ItemRenderer = React.memo(({ data, index, style }) => {
  const { urls, deleteItemAtIndex } = data;
  const deleteItem = () => deleteItemAtIndex(index);
  const urlObj = urls[index];

  // Rendering an extra item for the placeholder
  if (!urlObj) {
    return null;
  }

  return (
    <Draggable
      draggableId={urlObj.id}
      index={index}
      key={urlObj.id}
      isDragDisabled={urlObj.type === 'divider'}
    >
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            ...provided.draggableProps.style,
            ...style,
          }}
        >
          {urlObj.type === 'divider'
            ? DividerItem(urlObj, deleteItem)
            : UrlItem(urlObj, false, deleteItem)}
        </div>
      )}
    </Draggable>
  );
}, areEqual);

export default Folder;
