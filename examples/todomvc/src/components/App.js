import React from 'react';
import Header from '../containers/Header';
import MainSection from '../containers/MainSection';
import ErrorBlock from '../containers/ErrorBlock';

const App = () => (
  <div>
    <ErrorBlock />
    <Header />
    <MainSection />
  </div>
);

export default App;
