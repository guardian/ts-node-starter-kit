#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');

const FILE_WHITELIST = [
    './riff-raff.yaml',
    './artifact.json',
    './package.json',
    './src/cdk/app.ts',
    './bin/package.sh',
];

const questions = {
    __APP_NAME__: 'Please enter your app name (required, e.g. contributions-service)',
    __BUCKET_NAME__:
        'Please enter your bucket name (required, e.g. aws-frontend-contributions-service)',
    __DESCRIPTION__: 'Please enter a short description for your project (required)',
    __RIFF_RAFF_PROJECT_NAME__:
        'Please enter your project name for Riff Raff (required, e.g. dotcom:contributions-service)',
    __STACK__: 'Please enter your stack (required, e.g. frontend)',
};

const replaceInFile = (fileName, answers) =>
    new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const placeholders = Object.keys(questions);
                const placeholdersRegex = new RegExp(`(${placeholders.join('|')})`, 'g');
                const result = data.replace(placeholdersRegex, match => answers[match]);

                fs.writeFile(fileName, result, 'utf8', err => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });

const templateAnswersIntoProject = answers =>
    Promise.all(FILE_WHITELIST.map(fileName => replaceInFile(fileName, answers)));

const isPresent = answer => !!answer;

const questionsForEnquirer = Object.keys(questions).map(name => ({
    name,
    message: questions[name],
    validate: isPresent,
}));

inquirer
    .prompt(questionsForEnquirer)
    .then(templateAnswersIntoProject)
    .catch(e => console.log('Something went wrong: ', e));
