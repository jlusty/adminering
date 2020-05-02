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

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  border-radius: 2px;
  width: 300px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const TitleBar = styled.div`
  flex-grow: 1;
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

const Folder = ({ folder, urls, index, removeUrlOrDivider, ...props }) => {
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
        >
          <TitleBar {...provided.dragHandleProps}>
            <Title folderId={folder.id} isEditingTitle={isEditingTitle} />
          </TitleBar>
          <BtnBox>
            <EditBtn
              onClick={() => dispatch(setEditingTitle(folder.id))}
              isEditingTitle={isEditingTitle}
            />
            <MinimiseBtn
              onClick={() => dispatch(toggleMinimised(folder.id))}
              isMinimised={isMinimised}
            />
          </BtnBox>
          <ItemList
            isMinimised={isMinimised}
            folder={folder}
            urls={urls}
            removeUrlOrDivider={removeUrlOrDivider}
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
          {UrlItem(urls[rubric.source.index], () => {})}
        </div>
      )}
    >
      {(provided, snapshot) => {
        let height = 500;
        let itemCount = snapshot.isUsingPlaceholder
          ? urls.length + 1
          : urls.length;

        if (isMinimised) {
          height = 50;
          itemCount = 0;
        }

        return (
          <UrlList isDraggingOver={snapshot.isDraggingOver}>
            <FixedSizeList
              height={height}
              itemCount={itemCount}
              itemSize={100}
              width={250}
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
      {provided => (
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
            : UrlItem(urlObj, deleteItem)}
        </div>
      )}
    </Draggable>
  );
}, areEqual);

export default Folder;
