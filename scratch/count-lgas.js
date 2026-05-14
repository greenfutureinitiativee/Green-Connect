import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('src/data/lgas.json', 'utf8'));
let total = 0;
data.forEach(s => total += s.lgas.length);
console.log('Total LGAs:', total);
