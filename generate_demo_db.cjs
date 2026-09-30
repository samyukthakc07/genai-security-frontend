const fs = require('fs');

const orgNames = ['Acme Financial Services', 'Nova Healthcare', 'Vertex Technologies', 'BlueWave Telecom', 'Atlas Manufacturing', 'Nexa Energy', 'Orion Retail', 'Internal Security Lab'];
const industries = ['Financial Services', 'Healthcare', 'Technology', 'Telecommunications', 'Manufacturing', 'Energy', 'Retail', 'Research'];
const regions = ['North America', 'Europe', 'Global', 'APAC'];

const ts = new Date().toISOString();

const orgs = orgNames.map((name, i) => ({
    id: `org-${i+1}`,
    name,
    industry: industries[i],
    region: regions[i % regions.length],
    owner: `admin@${name.toLowerCase().split(' ')[0]}.com`,
    status: 'Active',
    risk_score: Math.floor(Math.random() * 40) + 40,
    compliance_coverage: Math.floor(Math.random() * 30) + 60,
    created_at: ts
}));

const projects = [];
let pId = 1;
orgs.forEach(org => {
    const numProjects = org.id === 'org-1' ? 4 : 2;
    for (let i = 0; i < numProjects; i++) {
        projects.push({
            id: `proj-${pId}`,
            organization: org.id,
            name: `Security Initiative ${pId}`,
            description: `Review and secure genai deployments for ${org.name}`,
            status: 'active',
            risk_score: Math.floor(Math.random() * 50) + 30,
            created_at: ts
        });
        pId++;
    }
});

const assets = [];
let aId = 1;
projects.forEach(proj => {
    for (let i = 0; i < 2; i++) {
        assets.push({
            id: `asset-${aId}`,
            organization: proj.organization,
            project: proj.id,
            name: `AI Asset ${aId}`,
            type: aId % 3 === 0 ? 'AI Agent' : (aId % 2 === 0 ? 'LLM Application' : 'Vector Store'),
            model: 'GPT-4',
            environment: 'Production',
            risk_score: Math.floor(Math.random() * 50) + 30,
            status: 'Active',
            created_at: ts
        });
        aId++;
    }
});

const scans = [];
let sId = 1;
assets.forEach(asset => {
    for (let i = 0; i < 2; i++) {
        scans.push({
            id: `scan-${sId}`,
            name: `${asset.name} Weekly Scan`,
            asset: asset.id,
            project: asset.project,
            organization: asset.organization,
            status: 'completed',
            passed: Math.floor(Math.random() * 20) + 10,
            failed: Math.floor(Math.random() * 5),
            risk_score: Math.floor(Math.random() * 50) + 30,
            assessment_type: 'Prompt Injection Assessment',
            created_at: ts
        });
        sId++;
    }
});

const findings = [];
let fId = 1;
scans.forEach(scan => {
    const numFindings = scan.failed;
    for (let i = 0; i < numFindings; i++) {
        findings.push({
            id: `find-${fId}`,
            title: `Vulnerability ${fId} in ${scan.name}`,
            severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random()*4)],
            status: 'open',
            asset: scan.asset,
            project: scan.project,
            organization: scan.organization,
            scan: scan.id,
            category: 'Prompt Injection',
            risk_score: Math.floor(Math.random() * 40) + 50,
            description: 'Simulated vulnerability for demo purposes.',
            created_at: ts
        });
        fId++;
    }
});

const reports = [];
for (let i = 1; i <= 12; i++) {
    reports.push({
        id: `rep-${i}`,
        name: `Executive Security Report Q${(i%4)+1}`,
        type: 'Executive',
        organization: orgs[i % orgs.length].id,
        risk: 'High',
        status: 'Generated',
        created_at: ts
    });
}

const db = {
    organizations: orgs,
    projects: projects,
    ai_assets: assets,
    scans: scans,
    findings: findings,
    reports: reports,
};

fs.writeFileSync('src/data/demoDatabase.json', JSON.stringify(db, null, 2));
console.log('Database generated.');
