const fs = require('fs');
const path = require('path');
const filesFile = path.join(__dirname, '../data/files.json');

function getFiles() {
    return JSON.parse(fs.readFileSync(filesFile, 'utf-8'));
}

function uploadFile(filename, type, size, owner, url) {
    const files = getFiles();
    const newFile = {
        id: files.length+1,
        filename,
        type,
        size,
        url,
        owner
    };
    files.push(newFile);
    fs.writeFileSync(filesFile, JSON.stringify(files,null,2));
    return newFile;
}

module.exports = {getFiles, uploadFile};
