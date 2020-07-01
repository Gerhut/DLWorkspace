import * as React from 'react';
import {
  FunctionComponent,
  Suspense,
  lazy
} from 'react';

import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const Submission = lazy(() => import('./pages/Submission'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Job = lazy(() => import('./pages/Job'));
const Clusters = lazy(() => import('./pages/Clusters'));
const Cluster = lazy(() => import('./pages/Cluster'));

const Routes: FunctionComponent = () => (
  <Suspense fallback={<Loading>Loading Your Page...</Loading>}>
    <Switch>
      <Route exact path="/" component={Home}/>

      <Route path="/submission" component={Submission}/>

      <Route strict exact path="/jobs/:clusterId/:jobId" component={Job}/>
      <Redirect strict exact from="/jobs/:clusterId" to="/jobs/:clusterId/"/>
      <Route strict exact path="/jobs/:clusterId/" component={Jobs}/>
      <Redirect strict exact from="/jobs" to="/jobs/"/>
      <Route strict exact path="/jobs/" component={Jobs}/>

      <Redirect strict exact from="/clusters" to="/clusters/"/>
      <Route strict exact path="/clusters/" component={Clusters}/>
      <Route strict exact path="/clusters/:clusterId" component={Cluster}/>

      <Redirect path="/job/:team/:clusterId/:jobId" to="/jobs/:clusterId/:jobId"/>

      {/* 404 */}
      <Redirect to="/"/>
    </Switch>
  </Suspense>
);

export default Routes;
