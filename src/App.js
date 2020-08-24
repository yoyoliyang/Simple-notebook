import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './blog.css'
import List from "./components/List"
import Header from "./components/Header"
import Login from "./components/Login"
import Footer from "./components/Footer"
import Page from "./components/Page"
import View from './components/View'
import Add from './components/Add'
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { LoginTokenProvider, LoginStatusProvider } from "./components/LoginTokenContext"
import { CookiesProvider } from "react-cookie"
import NotFound from './components/NotFound';
import { githubPageName } from './components/tools/Env'

const App = () => {

  return (
    <CookiesProvider>
      <Router>
        <LoginTokenProvider>
          <LoginStatusProvider>
            <Header />
            <Switch>
              <Route exact path={githubPageName + '/page'} component={Page} />
              <Route exact path={githubPageName + '/add'} component={Add} />
              <Route exact path={githubPageName} component={List} />
              <Route exact path={githubPageName + '/login'} component={Login} />
              <Route exact path={githubPageName + '/404'} component={NotFound} />
              {/* 此处注意排序 */}
              <Route exact path={githubPageName + '/:slug'} component={View} />
            </Switch>
            <Footer />
          </LoginStatusProvider>
        </LoginTokenProvider>
      </Router>
    </CookiesProvider>
  );
}

export default App;
