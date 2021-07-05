import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Collapse,
} from '@material-ui/core';
import { RemoveCircle } from '@material-ui/icons';
import './styles/Checklist.scss';

export function CheckList(props) {
  const { handleUpdate, list, readOnly } = props;
  const [checkListExpanded, updateChecklistExpanded] = React.useState([]);

  const handleUpdateCheckList = (e) => {
    let newList = list;
    const itemId = Number(e.target.id);
    if (e.target.name === 'checkbox') {
      newList[itemId].checked = !list[itemId].checked;
    }
    if (e.target.name === 'delete') {
      newList = newList.filter((item, idx) => {
        return idx !== itemId;
      });
    }

    handleUpdate([...newList]);
  };

  const handleToggleExpand = (e, key) => {
    if (e.target.name !== 'checkbox') {
      checkListExpanded.indexOf(key) > -1
        ? updateChecklistExpanded(
            checkListExpanded.filter((item) => item !== key)
          )
        : updateChecklistExpanded([...checkListExpanded, key]);
    }
  };

  return (
    <Box className="checklist-container">
      <List>
        {list.map((todo, idx) => {
          return (
            <Paper
              className="checklist-item"
              onClick={(e) => {
                e.target.id = idx;
                handleToggleExpand(e, todo.label);
              }}
              key={todo.label}
            >
              <ListItem key={todo.label} dense button>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={todo.checked}
                    // tabIndex={-1}
                    disableRipple
                    id={String(idx)}
                    name="checkbox"
                    onChange={handleUpdateCheckList}
                    color="primary"
                    // readOnly={readOnly}
                    disabled={readOnly}
                  />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Typography noWrap>{todo.label}</Typography>
                </ListItemText>
                {!readOnly && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.target.id = idx;
                        e.target.name = 'delete';
                        handleToggleExpand(e, todo.label);
                        handleUpdateCheckList(e);
                      }}
                      size="small"
                    >
                      <RemoveCircle className="delete-list-item" />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Collapse
                in={checkListExpanded.includes(todo.label)}
                timeout="auto"
                unmountOnExit
              >
                <ListItem style={{ overflowWrap: 'break-word' }}>
                  <ListItemText>{todo.label}</ListItemText>
                </ListItem>
              </Collapse>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
}
