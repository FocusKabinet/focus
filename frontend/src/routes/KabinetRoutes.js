import { Redirect, Route } from 'react-router-dom';
import Page from '../components/kabinet/Page';
import KabinetDashboard from '../pages/KabinetDashboard';
import KabinetEditIdea from '../pages/KabinetEditIdea';
import KabinetNewIdea from '../pages/KabinetNewIdea';
import Navigation from '../components/kabinet/Navigation';
import KabinetTrendings from '../pages/KabinetTrendings';
import KabinetAuth from '../pages/KabinetAuth';
import KabinetProfile from '../pages/KabinetProfile';
import KabinetPost from '../pages/KabinetPost';

export default function KabinetRoutes(props) {
  return (
    <>
      <Route
        path="/kabinet-world"
        render={(routeProps) => (
          <>
            <Page {...routeProps}>
              <KabinetDashboard {...routeProps} />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-home"
        render={(routeProps) => (
          <>
            <Page {...routeProps}>
              <KabinetDashboard {...routeProps} collection />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-bookmarked"
        render={(routeProps) => (
          <>
            <Page {...routeProps}>
              <KabinetDashboard {...routeProps} bookmarked />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-trends"
        render={(routeProps) => (
          <>
            <Page {...routeProps}>
              <KabinetTrendings {...routeProps} />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-login"
        render={(routeProps) => (
          <>
            <Page {...routeProps} auth>
              <KabinetAuth {...routeProps} />
            </Page>
          </>
        )}
      />
      <Route
        path="/kabinet-register"
        render={(routeProps) => (
          <>
            <Page {...routeProps} auth>
              <KabinetAuth {...routeProps} register />
            </Page>
          </>
        )}
      />
      <Route
        path="/kabinet-new"
        render={(routeProps) => (
          <Page {...routeProps}>
            <KabinetNewIdea {...routeProps} />
          </Page>
        )}
      />
      <Route
        path="/kabinet-profile"
        render={(routeProps) => (
          <Page {...routeProps}>
            <KabinetProfile {...routeProps} />
          </Page>
        )}
      />
      <Route
        path="/kabinet-edit/:id"
        render={(routeProps) => (
          <Page {...routeProps}>
            <KabinetEditIdea {...routeProps} />
          </Page>
        )}
      />
      <Route
        path="/kabinet-user/:displayName"
        render={(routeProps) => (
          <Page {...routeProps}>
            <KabinetDashboard {...routeProps} viewUser />
          </Page>
        )}
      />
      <Route
        exact
        path="/kabinet-post/:id"
        render={(routeProps) => (
          <Page {...routeProps}>
            <KabinetPost {...routeProps} />
          </Page>
        )}
      />
      <Route exact path="/kabinet-post/">
        <Redirect to="/kabinet-world" />
      </Route>
      <Route exact path="/">
        <Redirect to="/kabinet-world" />
      </Route>
    </>
  );
}
