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

const App = () => {

  return (
    <CookiesProvider>
      <Router>
        <LoginTokenProvider>
          <LoginStatusProvider>
            <Header />
            <Switch>
              <Route exact path={'/page'} component={Page} />
              <Route exact path={'/add'} component={Add} />
              <Route exact path={'/'} component={List} />
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/404'} component={NotFound} />
              {/* 此处注意排序 */}
              <Route exact path={'/:slug'} component={View} />
            </Switch>
            <Footer />
          </LoginStatusProvider>
        </LoginTokenProvider>
      </Router>
    </CookiesProvider>
  );
}

export default App;
