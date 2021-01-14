const { exec } = require("child_process");

const login = () => {
    
}

const getPods = () => {
    exec("kubectl --context=dev get namespaces -o json", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

const getPods = (context= "dev", namepsace) => {
    exec(`kubectl --context=dev --namespace=${namepsace} get po -o json`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);

        const result = JSON.parse(stdout)
        const data = {
            status: result.status
        }
    });
}

module.exports = {
    getPods
}