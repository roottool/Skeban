import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './App'
import AppState from './State'
import ListState from './State/List'
import CardState from './State/Card'
// eslint-disable-next-line import/extensions
import 'typeface-roboto'

ReactDOM.render(
  <CardState.Provider>
    <ListState.Provider>
      <AppState.Provider>
        <HashRouter>
          <App />
        </HashRouter>
      </AppState.Provider>
    </ListState.Provider>
  </CardState.Provider>,
  document.getElementById('root')
)
