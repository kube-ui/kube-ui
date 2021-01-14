# Kubectl client

## Login

## Get Namespaces

```
[
    {
        "name": item.metadata.name,
        "team": item.metadata.labels.team,
        "area": item.metadata.labels['area-name'],
        "slack": item.metadata.annotations.slack 
    }
]
```

## Get pods

```
[
    {
        "service": String,
        "status": String,
        "pods": Number,
        "ready-pods": Number
    }
]
```

## Get deployemnts

```
[
    {
        "service": item.metadata.labels['app.kubernetes.io/name'],
        "pods": item.status.replicas,
        "ready-pods": item.status.readyReplicas,
        "last-deployed": lastDeployed,
        "name": namespace
    }
]
```
