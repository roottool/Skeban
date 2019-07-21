import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DB, { CardTable } from "../../DB";
import ListTitleArea from "../ListTitleArea";
import Card from "../Card";

interface Props {
  boardId: number;
  listId: number;
  listIndex: number;
}

const KanbanCardList: React.FC<Props> = props => {
  const isInitialMount = useRef(true);

  const { boardId, listId, listIndex } = props;

  const [cards, setCards] = useState<CardTable[]>([]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      DB.cardTable
        .where("listId")
        .equals(listId)
        .sortBy("index")
        .then(data => setCards(data))
        .catch(err => {
          throw err;
        });
    } else {
      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  }, [cards]);

  const onNewCardAdditionCompleted = () => {
    DB.cardTable
      .where("listId")
      .equals(listId)
      .toArray()
      .then(data => {
        setCards(data);
      })
      .catch(err => {
        throw err;
      });
  };

  const onAddBtnClicked = () => {
    DB.cardTable
      .add({
        listId,
        index: cards.length,
        text: ""
      })
      .then(() => {
        onNewCardAdditionCompleted();
      })
      .catch(err => {
        throw err;
      });
  };

  const renderCards = () => {
    const result = cards.map((card, cardIndex) => {
      if (!card.id) {
        return <></>;
      }

      return (
        <Card
          key={card.id}
          listId={listId}
          cardId={card.id}
          cardIndex={cardIndex}
          setCards={setCards}
        />
      );
    });

    return result;
  };

  return (
    <Draggable draggableId={`${listId}`} index={listIndex}>
      {provided => (
        <StyledPaper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <ListTitleArea boardId={boardId} listId={listId} />
          <Droppable droppableId={`${listId}`} type="Card">
            {cardProvided => (
              <StyledContainer
                {...cardProvided.droppableProps}
                ref={cardProvided.innerRef}
              >
                {renderCards()}
                {cardProvided.placeholder}
              </StyledContainer>
            )}
          </Droppable>
          <StyledAddButtonArea>
            <Fab color="secondary" aria-label="Add" onClick={onAddBtnClicked}>
              <AddIcon />
            </Fab>
          </StyledAddButtonArea>
        </StyledPaper>
      )}
    </Draggable>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
  height: fit-content;
  flex: 0 0 360px;
  margin: 16px;
`;

const StyledContainer = styled.div`
  padding-bottom: 40px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;
