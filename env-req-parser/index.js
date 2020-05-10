const core = require('@actions/core');
const github = require('@actions/github');

try {
    if(github.context.payload.action != 'labeled') return;

    const issue = github.context.payload.issue;
    if(!issue) return;
    if(!issue.body) return;
    if(!issue.labels) return;

    console.log("Issue is approved correctly.")

    let appName = "", armTemplate = "", applyPolicy = false, policyName = "", policyDefinition = "";

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
            policyName = "Audit PCI";       
            policyDefinition = "[Preview]: Audit PCI v3.2.1:2018 controls and deploy specific VM Extensions to support audit requirements";
        }
        if (lines[i].startsWith("- [x] HIPAA")) {
            applyPolicy = true;
            policyName = "Audit HITRUST/HIPAA";
            policyDefinition = "Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements";
        }
    }

    core.setOutput("appName", appName);
    core.setOutput('armTemplate', armTemplate);
    core.setOutput('approved', 'true');
    core.setOutput('applyPolicy', applyPolicy ? 'true' : 'false');
    core.setOutput('policyName', policyName);
     core.setOutput('policyDefinition', policyDefinition);

    console.log("appName: ", appName);
    console.log('armTemplate: ', armTemplate);
    console.log('approved: ', 'true');
    console.log('applyPolicy: ', applyPolicy ? 'true' : 'false');
    console.log('policyName: ', policyName);
    console.log('policyDefinition: ', policyDefinition);

} catch(error) {
    core.setFailed(error.message);
    core.setFailed(`Error - Github Actions failure: ${error}`);
}


