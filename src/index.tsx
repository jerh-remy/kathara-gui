import React from 'react';
import { render } from 'react-dom';
import './App.global.css';
import { Home } from './components/Home';
import { KatharaLabStatusProvider } from './contexts/katharaLabStatusContext';

render(
  <KatharaLabStatusProvider>
    <Home />
  </KatharaLabStatusProvider>,
  document.getElementById('root')
);
