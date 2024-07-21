//const Overview = React.lazy(() => import('./pages//Overview.jsx'));
//const Sessions = React.lazy(() => import('./pages//Sessions.jsx'));
import Sessions from './Sessions.jsx';
import Overview from './Overview.jsx';
import Layout from './Layout.jsx';


function Router() {
  return (
    <Route path="/settings" element={<Layout />}>
      <Route index element={<Overview />} />
      <Route path="sessions" element={<Sessions />} />
    </Route>
  );
}


export default Router;
