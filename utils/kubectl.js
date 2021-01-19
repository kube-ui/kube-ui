const { exec } = require("child_process");
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");

const getContext = (environments, defaultEnvironment) => {
    if(environments[defaultEnvironment]) {
        const [ context, namespace ] = environments[defaultEnvironment].split(':')

        return {
            context,
            namespace
        }
    }

    return {
        context: 'dev'
    }
}

const login = (loginCommand) => {
    if(!loginCommand) {
        return
    }

    return new Promise(function(resolve, reject){
        exec(`${loginCommand}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error logging in with osprey: ${error.message}`);
                reject({
                    success: false,
                    error: error.message
                })
                return;
            }

            resolve({
                success: true
            })       
        });  
     })
}

const getNamespaces = (kubectlAlias, context) => {
    return new Promise(function(resolve, reject){
        exec(`${kubectlAlias} --context=${context} get namespaces -o json`, {maxBuffer: 1024 * 5000}, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                reject({
                    success: false,
                    error: error.message
                })
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject({
                    success: false,
                    error: error.message
                })
            }

            const result = JSON.parse(stdout);

            resolve({
                success: true,
                data: result.items.map(item => {
                    return {
                        "name": item.metadata.name,
                        "team": item.metadata.labels.team,
                        "area": item.metadata.labels['area-name'],
                        "slack": item.metadata.annotations.slack    
                    }
                })
            });
        });
    });
}

const getNamespaceDetails = (kubectlAlias, context, namespace) => {
    return new Promise(function(resolve, reject){
        exec(`${kubectlAlias} --context=${context} --namespace=${namespace} get deployments -o json`, {maxBuffer: 1024 * 5000}, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error reading deployments from kubernetes: ${error.message}`);
                reject({
                    success: false,
                    error: error.message
                })
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject({
                    success: false,
                    error: stderr
                })
                return;
            }

            const result = JSON.parse(stdout);
            

            const data = result.items.map(item => {
                const newReplicaSetCondition = item.status.conditions.find(
                    element => element.reason === "NewReplicaSetAvailable"
                )
                
                var lastDeployed
                if (newReplicaSetCondition != undefined) {
                    lastDeployed = newReplicaSetCondition.lastUpdateTime
                } else {
                    lastDeployed = items.metadata.creationTimestamp
                }

                return {
                    "service": item.metadata.labels['app.kubernetes.io/name'],
                    "pods": item.status.replicas,
                    "ready-pods": item.status.readyReplicas,
                    "last-deployed": lastDeployed,
                    "name": namespace
                }
            });
            
            resolve({
                success: true,
                data: data
            });
        });
    });
}

const getPods = (kubectlAlias, context, namespace) => {
    return new Promise(function(resolve, reject){
        exec(`${kubectlAlias} --context=${context} --namespace=${namespace} get po -o json`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error reading deployments from kubernetes: ${error.message}`);
                reject({
                    success: false,
                    error: error.message
                })
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject({
                    success: false,
                    error: stderr
                })
                return;
            }

            const result = JSON.parse(stdout);

            const data = result.items.map(item => {
                return {
                    "service": item.metadata.labels['app.kubernetes.io/name'],
                    "status": item.status.phase,
                    "startTime": item.status.startTime  
                }
            });

            resolve({
                success: true,
                data: data
            });
        });
    });
}

module.exports = {
    getContext,
    login,
    getNamespaces,
    getNamespaceDetails,
    getPods
}