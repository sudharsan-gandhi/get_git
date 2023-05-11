#!/usr/bin/env node

import {Command} from 'commander';
import {execSync} from 'child_process';
import inquirer from 'inquirer';
import {join} from 'path';

interface Answers {
  gitUrl: string;
  username: string;
  password: string;
  foldername?: string;
}

const program = new Command();

program
  .name('getgit')
  .alias('gg')
  .description('Clone a Git repository with username and password')
  .action(async () => {
    const answers: Answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'gitUrl',
        message: 'Enter Git HTTPS URL:',
      },
      {
        type: 'input',
        name: 'username',
        message: 'Enter Git username:',
      },
      {
        type: 'password',
        name: 'password',
        mask: true,
        message: 'Enter Git password:',
      },
      {
        type: 'input',
        name: 'foldername',
        message: 'Enter folder name to clone into (optional):',
      },
    ]);

    const {gitUrl, username, password, foldername} = answers;
    const url = new URL(gitUrl);
    url.username = username;
    url.password = password;

    const cmd = `git clone ${url.href}`;
    const cwd = foldername ? join(process.cwd(), foldername) : process.cwd();

    execSync(cmd, {stdio: 'inherit', cwd});
  });

program.parse(process.argv);
