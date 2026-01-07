import fs from 'fs';
import * as Nigeria from 'nigerian-states-and-lgas';

try {
    const data = Nigeria.all();
    fs.writeFileSync('src/data/lgas.json', JSON.stringify(data, null, 2));
    console.log('LGA data extracted successfully!');
} catch (error) {
    console.error('Error extracting data:', error);
    // Fallback if .all() doesn't exist, try to log the export to see what's there
    console.log('Export:', Nigeria);
}
