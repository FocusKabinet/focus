import React from 'react';
import { connect } from 'react-redux';
import IdeaCard from '../components/kabinet/IdeaCard';
import { fetchCard } from '../helpers/kabinetHelpers';
import './styles/KabinetPost.scss';

function KabinetPost(props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [card, updateCard] = React.useState(null);

  const fetchData = React.useCallback(async () => {
    const data = await fetchCard(id);
    updateCard(data);
    return;
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [props.params, fetchData]);

  if (card)
    return (
      <IdeaCard
        {...card}
        history={props.history}
        params={props.match.params}
        singleView
      />
    );
  else return null;
}

const mapStateToProps = (state) => {
  return {
    user: state.kabinet_user,
  };
};

export default connect(mapStateToProps)(KabinetPost);
