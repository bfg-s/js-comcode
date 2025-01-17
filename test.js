const PhpBuilder = require('./index');
const path = require('path');
const builder = new PhpBuilder(path.join(__dirname, 'test.php'));

builder.namespace('App\\Models');
builder.use('Illuminate\\Database\\Eloquent\\Model');
builder.class('Test');
builder.extends('Model');

builder.publicProperty('name', null);

builder.save();

