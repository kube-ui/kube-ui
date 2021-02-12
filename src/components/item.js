import { Card, CardContent, Grid, IconButton } from "@material-ui/core";

import React from 'react';
import { Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useCardStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "#282F46",
      color: "#CDD1D7",
    },
    title: {
      fontSize: 18,
      color: "#CDD1D7",
      fontWeight: "bold",
    },
    pos: {
      marginBottom: 12,
    }
  }));

const Item = ({item, onNamespaceGetDetails}) => {
    const classes = useCardStyles();

    const handleNamespaceGetDetails = (namespaceName) => {
      onNamespaceGetDetails(namespaceName)
    }

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent className="namespace-details-container">
          <Grid className="namespace-details" container justify="space-between">
            <Grid className="title" item xs={10}>
              {item.service ? item.service : item.name}
            </Grid>
            <Grid className="value" item xs={2}>
              <IconButton className="refresh-icon" color="primary" aria-label="refresh" component="span" onClick={() => handleNamespaceGetDetails(item.name)}>
                  <Refresh />
              </IconButton>
            </Grid>
          </Grid>
          
          <Grid className="namespace-details" container justify="space-between">
            <Grid className="label" item xs>Status</Grid>
            <Grid className="value" item xs>{item.status}</Grid>
          </Grid>
          <Grid className="namespace-details" container justify="space-between">
            <Grid className="label" item xs>Pods</Grid>
            <Grid className="value" item xs>{item['ready-pods']}/{item.pods}</Grid>
          </Grid>
          <Grid className="namespace-details" container justify="space-between">
            <Grid className="label" item xs>Team</Grid>
            <Grid className="value" item xs>{item.slack}</Grid>
          </Grid>
          <Grid className="namespace-details" container justify="space-between">
            <Grid className="label" item xs>Last deployed</Grid>
            <Grid className="value" item xs>{item['last-deployed']}</Grid>
          </Grid>
        </CardContent>
      </Card>
    );
}

export default Item
