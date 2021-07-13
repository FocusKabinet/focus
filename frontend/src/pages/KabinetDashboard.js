import React from 'react';
import {
  Grid,
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@material-ui/core';
import {
  Book,
  Clear,
  Create,
  DateRange,
  ExpandMore,
  Face,
  PhotoAlbum,
  Search,
} from '@material-ui/icons';
import './styles/KabinetDashboard.scss';
import { DatePicker } from '@material-ui/pickers';
import IdeaCard from '../components/kabinet/IdeaCard';
import {
  deleteCard,
  fetchBookmarkedCards,
  fetchCards,
  fetchUserCards,
} from '../helpers/kabinetHelpers';
import { getPublicUserByDisplayName } from '../helpers/kabinetProfile';
import { getVisibleCards } from '../helpers/kabinetSelectors';
import ScrollToTop from '../components/kabinet/ScrollToTop';
import { connect } from 'react-redux';
import { KeywordTags } from '../components/kabinet/KeywordTags';

function KabinetDashboard(props) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [cards, updateCards] = React.useState([]);
  const [initialCards, updateInitialCards] = React.useState([]);
  const [viewProfile, setViewProfile] = React.useState({});

  const fetchData = React.useCallback(async () => {
    if (props.user) {
      if (props.collection) {
        const data = await fetchUserCards();
        updateInitialCards(data);
        updateCards(data);
        return;
      }

      if (props.bookmarked) {
        const data = await fetchBookmarkedCards();
        updateInitialCards(data);
        updateCards(data);
        return;
      }
    }
    if (props.viewUser) {
      const displayName = props.match.params.displayName;
      const user = await getPublicUserByDisplayName(displayName);
      const data = await fetchUserCards(user.uid);
      setViewProfile(user);
      updateInitialCards(data);
      updateCards(data);
      return;
    }
    const data = await fetchCards();
    updateInitialCards(data);
    updateCards(data);
  }, [props]);

  React.useEffect(() => {
    fetchData();
  }, [props.user, fetchData]);

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
      {props.collection && (
        <>
          <Typography
            className="list-title"
            align="left"
            variant="h5"
            gutterBottom
          >
            <div className="view-user-title">
              <PhotoAlbum /> Your collection
            </div>
          </Typography>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() =>
              props.user
                ? props.history.push('/kabinet-new')
                : props.history.push('/kabinet-login')
            }
            fullWidth
            startIcon={<Create />}
          >
            Publish
          </Button>
        </>
      )}
      {props.bookmarked && (
        <>
          <Typography
            className="list-title"
            align="left"
            variant="h5"
            gutterBottom
          >
            <div className="view-user-title">
              <Book /> Your bookmarks
            </div>
          </Typography>
        </>
      )}
      {props.viewUser && !!Object.keys(viewProfile).length && (
        <>
          <Typography
            className="list-title"
            align="left"
            variant="h5"
            gutterBottom
          >
            <div className="view-user-title">
              <Face /> {`${viewProfile.displayName}'s collection`}
            </div>
          </Typography>
        </>
      )}
      <Grid
        container
        className="grid-container list"
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <PopularKeywords cards={initialCards} />
        </Grid>
        <Grid item>
          <SearchBar
            search={search}
            handleSearch={handleSearch}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            handleClearFilter={handleClearFilter}
          />
        </Grid>
        {cards.map((item, idx) => (
          <Grid item key={idx}>
            <IdeaCard
              className="card"
              {...item}
              history={props.history}
              deleteCard={handleDelete}
              collection={props.collection}
              params={props.match.params}
            />
          </Grid>
        ))}
      </Grid>
      <ScrollToTop />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.kabinet_user,
    bookmarks: state.kabinet_bookmarks,
  };
};

export default connect(mapStateToProps)(KabinetDashboard);

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
            InputProps={{
              endAdornment: <Search />,
            }}
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
            InputProps={{
              endAdornment: <DateRange />,
            }}
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

function PopularKeywords(props) {
  const [expanded, setExpand] = React.useState(false);
  const keywords = accumulateKeywords(props.cards);

  return (
    <div className="popular-keywords">
      <Accordion expanded={expanded} onChange={() => setExpand(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Keywords</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <KeywordTags keywords={keywords.map((key) => key[0])} readOnly />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function accumulateKeywords(cards) {
  let keywords = [];
  let accum = {};
  let data = [];
  cards.forEach((card) => {
    keywords = [...keywords, ...card.keywords];
  });
  keywords.forEach((key) => {
    accum[key] = (accum[key] || 0) + 1;
  });

  for (let key in accum) {
    data.push([key, accum[key]]);
  }
  data.sort((a, b) => {
    return b[1] - a[1];
  });
  return data;
}
