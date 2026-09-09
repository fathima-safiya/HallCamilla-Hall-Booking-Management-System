const fs = require('fs');
const path = require('path');

function replaceInDir(dir, replacements) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath, replacements);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content;
            for (const {from, to} of replacements) {
                modified = modified.split(from).join(to);
            }
            if (content !== modified) {
                fs.writeFileSync(fullPath, modified);
                console.log('Fixed', fullPath);
            }
        }
    }
}

// 1. For public, customer, shared:
const replacements1 = [
    {from: 'from \'../context/', to: 'from \'../../context/'},
    {from: 'from "../context/', to: 'from "../../context/'},
    {from: 'from \'../lib/', to: 'from \'../../lib/'},
    {from: 'from "../lib/', to: 'from "../../lib/'},
    {from: 'from \'../types/', to: 'from \'../../types/'},
    {from: 'from "../types/', to: 'from "../../types/'},
    {from: 'from \'../components/', to: 'from \'../shared/'},
    {from: 'from "../components/', to: 'from "../shared/'}
];

replaceInDir('./src/modules/public', replacements1);
replaceInDir('./src/modules/customer', replacements1);
replaceInDir('./src/modules/shared', replacements1);

// 2. For admin:
const replacementsAdmin = [
    {from: 'from \'../../components/', to: 'from \'../../modules/shared/'},
    {from: 'from "../../components/', to: 'from "../../modules/shared/'}
];
replaceInDir('./src/modules/admin', replacementsAdmin);
