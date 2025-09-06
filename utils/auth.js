// auth.js
const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');

function getUsers() {
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function register(username, email, password, plan='free') {
    const users = getUsers();
    if(users.find(u => u.email === email)) return {error: 'Email sudah terdaftar'};
    const newUser = {id: users.length+1, username, email, password, plan};
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users,null,2));
    return newUser;
}

function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user || {error: 'Email/password salah'};
}

module.exports = {getUsers, register, login};
