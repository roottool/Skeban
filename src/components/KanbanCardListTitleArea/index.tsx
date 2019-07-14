import React, { useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";
import { CardListData } from "../KanbanCardList/interface";

interface Props {
  filename: string;
  value: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleKanbanCardListDelete: (filename: string) => void;
}

const KanbanCardListTitleArea: React.FC<Props> = props => {
  const { filename, value, setTitle, handleKanbanCardListDelete } = props;

  const [isInputArea, setIsInputArea] = useState(false);
  const [cardTitle, setCardTitle] = useState(value);
  const [isDelete, setIsDelete] = useState(false);

  const WrappedSetTitle = useCallback(() => {
    setTitle(cardTitle);
  }, [cardTitle]);

  const WrappedHandleKanbanCardListDelete = useCallback(() => {
    localStorage.removeItem(filename);
    handleKanbanCardListDelete(filename);
  }, [isDelete]);

  const saveTitleInLocalStorage = (title: string) => {
    const currentData = localStorage.getItem(filename) || "{}";
    const currentJsonData: CardListData = JSON.parse(currentData);
    const jsonData: CardListData = {
      title,
      data: currentJsonData.data
    };
    const saveData = JSON.stringify(jsonData);
    localStorage.setItem(filename, saveData);
  };

  const handleCardTitleChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardTitle(event.target.value);
    saveTitleInLocalStorage(event.target.value);
    WrappedSetTitle();
  };

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  const handleDeleteButtonClicked = () => {
    setIsDelete(true);
    WrappedHandleKanbanCardListDelete();
  };

  return (
    <StyledCardListTitleArea>
      {isInputArea ? (
        <StyledCardTitleForm>
          <StyledCardTitleTextField
            id="card-list-name"
            label="Card Title"
            value={cardTitle}
            margin="normal"
            autoFocus
            onChange={handleCardTitleChanged}
            onKeyPress={handleKeyPressed}
            onBlur={handleisInputAreaChange}
          />
        </StyledCardTitleForm>
      ) : (
        <StyledCardTitleDiv onClick={handleisInputAreaChange}>
          <Typography variant="h6" gutterBottom>
            {cardTitle || "The title is empty"}
          </Typography>
        </StyledCardTitleDiv>
      )}
      <StyledEditIconArea>
        <IconButton
          aria-label="Delete"
          color="primary"
          onClick={handleDeleteButtonClicked}
        >
          <DeleteIcon fontSize="large" />
        </IconButton>
      </StyledEditIconArea>
    </StyledCardListTitleArea>
  );
};

const StyledCardListTitleArea = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const StyledCardTitleForm = styled.form`
  flex-basis: 80%;
  margin-left: 8px;
`;

const StyledCardTitleTextField = styled(TextField)`
  width: 100%;
`;

const StyledCardTitleDiv = styled.div`
  flex-basis: 80%;
  margin-left: 8px;
  min-height: 72px;
  display: flex;
  align-items: center;
  word-break: break-word;
  cursor: pointer;
`;

const StyledEditIconArea = styled.div`
  flex-basis: 20%;
  text-align: center;
`;

export default KanbanCardListTitleArea;
