const core = require('@actions/core');
const github = require('@actions/github');

try {
    if(github.context.payload.action != 'labeled') return;

    const issue = github.context.payload.issue;
    if(!issue) return;
    if(!issue.body) return;
    if(!issue.labels) return;

    console.log("Issue is approved correctly.")

    let appName = "", armTemplate = "", applyPolicy = false, policyName = "", policyId = "";

    console.log(issue.body);
    const lines = issue.body.match(/[^\r\n]+/g)
    if (!lines) return;

    for(var i=0;i<lines.length;i++) {
        if (lines[i].startsWith("Application Name:"))
        appName = lines[i].substring(17,lines[i].length).trim();
        if (lines[i].startsWith("- [x] General"))
            armTemplate = "vmss-windows-nat";
        if (lines[i].startsWith("- [x] Web"))
            armTemplate = "web-app-sql-database";
        if (lines[i].startsWith("- [x] Serverless"))
            armTemplate = "function-app";
        if (lines[i].startsWith("- [x] PCI")) {
            applyPolicy = true;
            policyName = "496eeda9-8f2f-4d5e-8dfd-204f0a92ed41";   
            policyId = "/providers/Microsoft.Authorization/policySetDefinitions/496eeda9-8f2f-4d5e-8dfd-204f0a92ed41"
        }
        if (lines[i].startsWith("- [x] HIPAA")) {
            applyPolicy = true;
            policyName = "a169a624-5599-4385-a696-c8d643089fab";
            policyId = "/providers/Microsoft.Authorization/policySetDefinitions/a169a624-5599-4385-a696-c8d643089fab";
        }
    }

    core.setOutput("appName", appName);
    core.setOutput('armTemplate', armTemplate);
    core.setOutput('approved', 'true');
    core.setOutput('applyPolicy', applyPolicy ? 'true' : 'false');
    core.setOutput('policyName', policyName);
     core.setOutput('policyId', policyId);

    console.log("appName: ", appName);
    console.log('armTemplate: ', armTemplate);
    console.log('approved: ', 'true');
    console.log('applyPolicy: ', applyPolicy ? 'true' : 'false');
    console.log('policyName: ', policyName);
    console.log('policyId: ', policyId);

} catch(error) {
    core.setFailed(error.message);
    core.setFailed(`Error - Github Actions failure: ${error}`);
}


