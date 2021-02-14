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

**Define background cli tools:**  

Define cli alias:
```
{
    ...
    "kubectl": {
        "alias": "<alias-name>"
    }
    ...
}
```

Enable authentication:
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
     "kubectl": {
         "alias": "/usr/local/bin/kubectl"
      },
     "authentication": {
         "client-int": "/usr/local/bin/osprey user login"
     }
 }
```

2. Package the app

The following command packages the app and opens the `release-builds` directory:
```
npm run package #for mac
```

## Development

### Dependencies

Install dependencies:
```
npm install
```

### Running the app

Run the app in development mode:
```
npm start
```

Run the app in production mode:
```
npm run production
```

### Tests

Run the unit tests:
```
npm test
```

### Manage packages

Kube-ui is made up of several small projects that are tied together thanks to `Lerna`.  
`Lerna` is a tool to manage these packages by bootstraping them together as if the packages were already existing and available in your node_modules folder.  
`Lerna` has been configured to use the Github package registry.

* Check which packages have changed since the last release `npx lerna changed`.
* List all of the public packages in the current Lerna repo `npx lerna ls`.

#### How to create a new package

1. Add new package `lerna create`
2. Add lib code and tests
3. Update details packages.json

#### How to update/publish a package

1. Commit changes
2. Install package updates where needed for local tests `npm run packages:install`
3. Publish package updates `npm run packages:publish`
