import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';

import React from 'react';

const useHeaderStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1
    },
    paper: {
      backgroundColor: "#282F46"
    },
    control: {
      padding: theme.spacing(2),
    },
  }))

const Header = ({ onLogin }) => {
    const classes = useHeaderStyles()

    const handleLogin = () => {
      console.log("login")
      onLogin()
    }
    
    return (
      <AppBar className="app-header" position="static">
        <Toolbar>
          <div className="app-logo"></div>
          <Typography variant="h6" className={classes.title}>
            Kubernetes
          </Typography>
          <Button color="inherit" onClick={() => { handleLogin() }}>Login</Button>
        </Toolbar>
      </AppBar>
    );
}

export default Header
