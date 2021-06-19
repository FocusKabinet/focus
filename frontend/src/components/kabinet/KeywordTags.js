import React from 'react';
import { Chip, Box } from '@material-ui/core';
import './styles/KeywordTags.scss';
import { Stars } from '@material-ui/icons';

export function KeywordTags(props) {
  const {
    keywords = [],
    readOnly,
    handleChange,
    setPrimary,
    primaryKeyword,
  } = props;

  return (
    <Box className={`keyword-container ${readOnly ? 'readOnly' : ''}`}>
      {keywords.map((key, idx) => {
        const avatar =
          key === primaryKeyword ? (
            <Stars
              className="star"
              color="disabled"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            />
          ) : null;
        return readOnly ? (
          <Chip
            avatar={avatar}
            key={key}
            className={`tag${!!avatar ? ' primary' : ''}`}
            label={key}
          />
        ) : (
          <Chip
            avatar={avatar}
            key={key}
            className={`tag${!!avatar ? ' primary' : ''}`}
            label={key}
            onDelete={() => handleChange && props.handleChange(idx)}
            clickable
            onClick={(e) => {
              e.target.value = key;
              setPrimary(e);
            }}
          />
        );
      })}
    </Box>
  );
}
