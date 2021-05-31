import React from 'react';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import './styles/KabinetDashboard.scss';
import { DatePicker } from '@material-ui/pickers';
import IdeaCard from '../components/kabinet/IdeaCard';
import { deleteCard, fetchCards } from '../helpers/kabinetHelpers';
import { getVisibleCards } from '../helpers/kabinetSelectors';

function KabinetDashboard(props) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [cards, updateCards] = React.useState([]);
  const [initialCards, updateInitialCards] = React.useState([]);
  async function fetchData() {
    const data = await fetchCards();
    updateInitialCards(data);
    updateCards(data);
  }

  React.useEffect(() => {
    fetchData();
  }, [props]);

  React.useEffect(() => {
    updateCards(
      getVisibleCards(initialCards, { text: search, date: selectedDate })
    );
  }, [search, selectedDate, initialCards]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    await deleteCard(id);
    await fetchData();
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
    setSearch('');
  };
  return (
    <div className="kabinet-home">
      <Typography
        className="list-title"
        align="center"
        variant="h4"
        gutterBottom
      >
        Your drawer
      </Typography>
      <Button
        className="add-button"
        variant="contained"
        color="primary"
        onClick={() => props.history.push('/kabinet-new')}
        fullWidth
      >
        Add new idea
      </Button>
      <SearchBar
        search={search}
        handleSearch={handleSearch}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        handleClearFilter={handleClearFilter}
      />
      <Grid
        container
        className="grid-container list"
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={3}
      >
        {cards.map((item, idx) => (
          <Grid item key={idx}>
            <IdeaCard
              className="card"
              {...item}
              history={props.history}
              deleteCard={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default KabinetDashboard;

function SearchBar(props) {
  const {
    search,
    handleSearch,
    selectedDate,
    handleDateChange,
    handleClearFilter,
  } = props;
  return (
    <Paper className="actions">
      <Grid container className="grid-container actions" spacing={2}>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            className="search-field"
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={10} sm={4}>
          <DatePicker
            id="date-picker-dialog"
            label="Filter"
            format="MMM yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            views={['month', 'year']}
            inputVariant="outlined"
            disableFuture
            size="small"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <IconButton size="small" edge="start" onClick={handleClearFilter}>
            <Clear />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}
