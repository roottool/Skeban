import React, { useState } from "react";
import styled from "styled-components";
import uuidv1 from "uuid/v1";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";
import { CardListData, CardListState } from "./interface";

interface Props {
  filename: string;
  handleKanbanCardListDelete: (filename: string) => void;
}

const KanbanCardList: React.FC<Props> = props => {
  const { filename, handleKanbanCardListDelete } = props;
  const initialJsonData = localStorage.getItem(filename) || "{}";
  const initialCardList: CardListData = JSON.parse(initialJsonData);

  const [title, setTitle] = useState(initialCardList.title || "");
  const [cardList, setCardList] = useState<CardListState[]>(
    initialCardList.data || []
  );

  const deleteKanbanCard = (targetFilename: string) => {
    setCardList(prev => {
      return prev.filter(target => target.filename !== targetFilename);
    });
  };

  const handleAddButtonClicked = () => {
    setCardList(prev => [...prev, { filename: uuidv1() }]);
    const jsonData: CardListData = {
      title,
      data: cardList
    };
    const saveData = JSON.stringify(jsonData);
    localStorage.setItem(filename, saveData);
  };

  return (
    <StyledPaper>
      <KanbanCardListTitleArea
        filename={filename}
        value={title}
        setTitle={setTitle}
        handleKanbanCardListDelete={handleKanbanCardListDelete}
      />
      {cardList.map(card => (
        <KanbanCard
          key={card.filename}
          filename={card.filename}
          handleKanbanCardDelete={deleteKanbanCard}
        />
      ))}
      <StyledAddButtonArea>
        <Fab
          color="secondary"
          aria-label="Add"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
        </Fab>
      </StyledAddButtonArea>
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
  flex: 0 0 360px;
  margin: 16px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;
