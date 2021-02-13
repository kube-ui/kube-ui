import { Button, Grid } from "@material-ui/core";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useContentStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      backgroundColor: "#282F46"
    },
    margin: {
      margin: theme.spacing(1),
    }
  }))

const Content = ({ children }) => {
    const classes = useContentStyles()

    return (
      <div className="app-body">
        <Grid container className={classes.root} justify="center" spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {children}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  const EmptyContent = ({ text, action }) => {
    const handleAction = () => {
      console.log("login")
      action()
    }
    
    return (
      <div className="app-body">
        <Grid
          className="empty-body"
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={4}>
            <div className="paper-container">
              <Button variant="outlined" color="inherit" onClick={() => { handleAction() }}>{text}</Button>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }

  const ContentSwitch = ({state, contentMap}) => {
    const DynamicContent = contentMap[state] ? contentMap[state] : contentMap["default"]
    return (
        <DynamicContent />
    )
  }

  export {
      Content,
      EmptyContent,
      ContentSwitch
  }
  