import React from 'react';
import { Grid, Button, TextField, Paper, Typography } from '@material-ui/core';
import './styles/KabinetDashboard.scss';
import { DatePicker } from '@material-ui/pickers';
import IdeaCard from '../components/kabinet/IdeaCard';

function KabinetDashboard(props) {
  const [selectedDate, setSelectedDate] = React.useState(Date.now());
  const [search, setSearch] = React.useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const mockData = [
    {
      id: '1',
      emoji: {},
      title: 'What if I make an app that stores ideas?',
      subheader: 'September 14, 2016',
      description:
        'Create a React web app that help me store and develop ideas whenever.',
      img_url:
        'https://images.unsplash.com/photo-1541913299-273fd84d10c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80',
      keywords: ['application', 'react'],
      reminder: null,
      createdAt: 1621812290280,
      checklist: [
        { label: 'item 1', checked: true },
        { label: 'item 2', checked: false },
        { label: 'item 3', checked: true },
      ],
    },
    {
      id: '2',
      emoji: {},
      title: 'Wash my eyes with lime juice',
      subheader: 'September 14, 2016',
      description: 'Recommended by Steve-O',
      img_url: 'https://media.giphy.com/media/cGdPHFcAZ6oJq/giphy.gif',
      keywords: ['suicide', 'pain'],
      reminder: null,
      createdAt: 1621812290280,
      checklist: [
        { label: 'item 1', checked: true },
        { label: 'item 2', checked: false },
        { label: 'item 3', checked: true },
      ],
    },
    {
      id: '3',
      emoji: {},
      title: 'LinkedIn but for the losers - Disconnect',
      subheader: 'September 14, 2016',
      description:
        'LinkedIn is made for people to brag about their careers. How about a social media for people to show their failures?',
      img_url:
        'https://images.unsplash.com/photo-1494158064015-7ff877b5bb2b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
      keywords: ['rebel'],
      reminder: null,
      createdAt: 1621812290280,
      checklist: [
        { label: 'item 1', checked: true },
        { label: 'item 2', checked: false },
        { label: 'item 3', checked: true },
      ],
    },
  ];
  return (
    <div className="kabinet-home">
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
      <Typography
        className="list-title"
        align="center"
        variant="h5"
        gutterBottom
      >
        Your drawer
      </Typography>
      <Grid
        container
        className="grid-container list"
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={3}
      >
        {mockData.map((item, idx) => (
          <Grid item key={idx}>
            <IdeaCard className="card" {...item} history={props.history} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default KabinetDashboard;
