import React from 'react';
import { Grid, Button, TextField, Paper, Typography } from '@material-ui/core';
import './styles/KabinetDashboard.scss';
import { DatePicker } from '@material-ui/pickers';
import IdeaCard from '../components/kabinet/IdeaCard';
import { fetchCards } from '../helpers/kabinetHelpers';

function KabinetDashboard(props) {
  const [selectedDate, setSelectedDate] = React.useState(Date.now());
  const [search, setSearch] = React.useState('');
  const [cards, updateCards] = React.useState([]);

  React.useEffect(() => {
    function fetchData() {
      const data = fetchCards();
      updateCards(data);
    }
    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
      <Paper className="actions">
        <Grid container className="grid-container actions" spacing={3}>
          <Grid item xs={12} sm={4}>
            <Button
              className="add-button"
              variant="contained"
              color="primary"
              onClick={() => props.history.push('/kabinet-new')}
            >
              Add new idea
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <DatePicker
              id="date-picker-dialog"
              label="Filter by month"
              format="MMM yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              views={['month', 'year']}
            />
          </Grid>
        </Grid>
      </Paper>
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
            <IdeaCard className="card" {...item} history={props.history} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default KabinetDashboard;
