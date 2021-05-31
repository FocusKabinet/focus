import { Route } from 'react-router-dom';
import Page from '../components/kabinet/Page';
import KabinetDashboard from '../pages/KabinetDashboard';
import KabinetEditIdea from '../pages/KabinetEditIdea';
import KabinetNewIdea from '../pages/KabinetNewIdea';
import Navigation from '../components/kabinet/Navigation';
import KabinetTrendings from '../pages/KabinetTrendings';
export default function KabinetRoutes(props) {
  return (
    <>
      <Route
        path="/kabinet-home"
        render={(routeProps) => (
          <>
            <Page>
              <KabinetDashboard {...routeProps} />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-trends"
        render={(routeProps) => (
          <>
            <Page>
              <KabinetTrendings {...routeProps} />
            </Page>
            <Navigation {...routeProps} />
          </>
        )}
      />
      <Route
        path="/kabinet-new"
        render={(routeProps) => (
          <Page>
            <KabinetNewIdea {...routeProps} />
          </Page>
        )}
      />
      <Route
        path="/kabinet-edit/:id"
        render={(routeProps) => (
          <Page>
            <KabinetEditIdea {...routeProps} />
          </Page>
        )}
      />
    </>
  );
}
