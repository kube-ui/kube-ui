const { exec } = require("child_process");

const getPods = () => {
    exec("kubectl --context=dev --namespace=is-e2e get po -o json", (error, stdout, stderr) => {
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

module.exports = {
    getPods
}