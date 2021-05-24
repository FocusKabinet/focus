import React from 'react';
import { Chip, Box } from '@material-ui/core';
import './styles/KeywordTags.scss';

export function KeywordTags(props) {
  const { keywords = [], readOnly, handleChange } = props;
  return (
    <Box className="keyword-container">
      {keywords.map((key, idx) => {
        return readOnly ? (
          <Chip key={key} className="tag" label={key} color="primary" />
        ) : (
          <Chip
            key={key}
            className="tag"
            label={key}
            onDelete={() => handleChange && props.handleChange(idx)}
            color="primary"
          />
        );
      })}
    </Box>
  );
}
