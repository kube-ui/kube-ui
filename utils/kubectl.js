const { exec } = require("child_process");

const login = () => {
    return new Promise(function(resolve, reject){
        exec("osprey user login", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error logging in with osprey: ${error.message}`);
                reject({
                    success: false,
                    error: error.message
                })
                return;
            }
            
            // if (stderr) {
            //     console.error(`stderr: ${stderr}`);
            //     reject({
            //         success: false,
            //         error: stderr
            //     })
            //     return;
            // }
            
            console.log(`stdout: ${stdout}`);
            resolve({
                success: true
            })       
        });  
     })
}

const getNamespaces = () => {
    return new Promise(function(resolve, reject){
        exec("kubectl --context=dev get namespaces -o json", {maxBuffer: 1024 * 5000}, (error, stdout, stderr) => {
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


            const data = result.items.map(item => {
                return {
                    "name": item.metadata.name,
                    "team": item.metadata.labels.team,
                    "area": item.metadata.labels['area-name'],
                    "slack": item.metadata.annotations.slack    
                }
            });


            const stringifiedJson = JSON.stringify(data)
            // console.log(`stdout: ${stdout}`);
            console.log(`${stringifiedJson}`);
            resolve({
                success: true,
                data: data
            });
        });
    });
}

const getNamespaceDetails = (namespace) => {
    return new Promise(function(resolve, reject){
        exec(`kubectl --context=dev --namespace=${namespace} get deployments -o json`, {maxBuffer: 1024 * 5000}, (error, stdout, stderr) => {
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
                    "pods": item.status.replicas,
                    "ready-pods": item.status.readyReplicas,
                    "lastDeployed": item.status.conditions.find(
                        element => element.reason === "NewReplicaSetAvailable"
                        ).lastUpdateTime  
                }
            });
            const stringifiedJson = JSON.stringify(data)
            // console.log(`stdout: ${stdout}`);
            console.log(`${stringifiedJson}`);
            resolve({
                success: true,
                data: data
            });
        });
    });
}

const getPods = (namespace) => {
    return new Promise(function(resolve, reject){
        exec(`kubectl --context=dev --namespace=${namespace} get po -o json`, (error, stdout, stderr) => {
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
            
            const stringifiedJson = JSON.stringify(data)
            console.log(stringifiedJson)
            resolve({
                success: true,
                data: data
            });
        });
    });
}

module.exports = {
    login,
    getNamespaces,
    getNamespaceDetails,
    getPods
}