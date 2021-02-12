import './layout.css';

import Header from './header'
import React from 'react';

const Layout = ({ onLogin, children }) => {
	return (
    <>
      <Header onLogin={onLogin} />
      {children}
    </>
	)
}

export default Layout