# KubeUI

A web-based UI to manage Kubernetes namespaces and troubleshoot issues across different environments. It will be built with Electron (NodeJs and Chromium) and use kubectl in the background.

## Getting Started

1. Define a configuration file

Add a custom configuration file in your home directory `<home-directory>/kubeui/config.json`.

**Define environments:**  

An environment should be the combination on a context and namespace. The context value is passed as a `kubectl` command argument `--context` and the namespace value is used to filter namespaces returned by `kubectl` by checking if the value is contained in the namespaces name.
```
{
    ...
    "environments": {
        "<enronment-name>": "<context>:<namespace>"
    },
    "default-environment": "<enronment-name>"
    ...
}
```

**Override defaults:**  

By default `kubectl` is used to run commands, define cli alias:
```
{
    ...
    "kubectl": {
        "alias": "<alias-name>"
    }
    ...
}
```

By default Kubernetes authentication is disabled, enable authentication:
```
{
    ...
    "authentication": {
        "<enronment-name>": "<cli-command>"
    }
    ...
}
```

**Example:**  
```
 {
     "environments": {
         "client-int": "dev:client-int"
     },         
     "default-environment": "client-int",
     "authentication": {
         "client-int": "osprey user login"
     }          
 }
```

2. Package the app

The following command packages the app and opens the `release-builds` directory:
```
npm run package #for mac
```

## Development

Run the app in development mode:
```
npm start
```

Run the app in production mode:
```
npm run production
```
