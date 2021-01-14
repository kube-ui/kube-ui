import './layout.css';

import React, { useEffect, useState }from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Refresh from '@material-ui/icons/Refresh';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

const Item = ({item, onNamespaceGetDetails}) => {
    const classes = useCardStyles();

    const handleNamespaceGetDetails = (namespaceName) => {
      onNamespaceGetDetails(namespaceName)
    }

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {item.service ? item.service : item.name}
          </Typography>
          
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
            <Grid className="value" item xs>{item['ready-pods']}</Grid>
          </Grid>

        </CardContent>
        <CardActions>
            <IconButton color="primary" aria-label="refresh" component="span" onClick={() => handleNamespaceGetDetails(item.name)}>
                <Refresh />
            </IconButton>
        </CardActions>
      </Card>
    );
}

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

const Content = ({ namespaces, onNamespaceGetDetails }) => {
  const classes = useContentStyles()
  
  // const [age, setAge] = React.useState('');
  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };
  
  return (
    <div className="app-body">
      {/* <Grid container justify="center" spacing={2} className="filter-container">
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <FormControl className={classes.margin}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={age}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Area
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.margin}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={age}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Team
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.margin}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={age}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <MenuItem value="" disabled>
                  Environment
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            
            <div className="filters-right">
              <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            </div>
          </Paper>
        </Grid>
      </Grid> */}
      
      <Grid container className={classes.root} justify="center" spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {namespaces.map((item, index) => (
              <Grid key={index} item xs={4} className="namespace-item">
                <Item item={item} onNamespaceGetDetails={onNamespaceGetDetails} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const ContentSwitch = ({state, data, onLogin, onNamespaceGetDetails}) => {
  console.log(`App State ${state}`)
  switch(state) {
    case "loading":
      return (
        <EmptyContent text={"Loading..."} />
      )
    case "ready":
      return (
        <Content namespaces={data} onNamespaceGetDetails={onNamespaceGetDetails}/>
      )
    default:
      return (
        <EmptyContent text={"Login"} action={onLogin} />
      )
  }
}
    
const Layout = ({ namespaces, onLogin, appState, onNamespaceGetDetails }) => {
	return (
    <>
      <Header onLogin={onLogin} />
      <ContentSwitch state={appState} onLogin={onLogin} data={namespaces} onNamespaceGetDetails={onNamespaceGetDetails}/>
    </>
	)
}

export default Layout