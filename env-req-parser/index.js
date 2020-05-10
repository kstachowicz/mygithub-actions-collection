const core = require('@actions/core');
const github = require('@actions/github');

try {
    if(github.context.payload.action != 'labeled') return;

    const issue = github.context.payload.issue;
    if(!issue) return;
    if(!issue.body) return;
    if(!issue.labels) return;

    let labels = Array.from(issue.labels);
    let approved = labels.some(val =>name == "approved");

    if(!approved) {
        console.log("Issue is not approved.");
        core.setOutput("approved", 'false');
        return;
    }

    console.log("Issue is approved correctly.")

    let appName = "", armTemplate = "", applyPolicy = false, policyName = "";

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
        }
        if (lines[i].startsWith("- [x] HIPAA")) {
            applyPolicy = true;
            policyName = "Audit HITRUST/HIPAA";
        }
    }

    core.setOutput("appName", appName);
    core.setOutput('armTemplate', armTemplate);
    core.setOutput('approved', 'true');
    core.setOutput('applyPolicy', applyPolicy ? 'true' : 'false');
    core.setOutput('policyName', policyName);


} catch(error) {
    core.setFailed(error.message);
    core.setFailed(`Error - Github Actions failure: ${error}`);
}


