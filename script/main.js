/* ----------------------------- */
/*    Eddie's Portfolio Script   */
/*          (c) 2018 Eddie       */
/* ----------------------------- */

let stdout;
let env = {pwd: '/'};
let dir = {
  '/': {
    'log': {}
  }
}
let fgColor = 'white';
let bgColor = 'rgba(0, 0, 0, 0)';

function print(stream, str, fg = fgColor, bg = bgColor) {
  let node = document.createElement('pre');
  node.style.color = fg;
  node.style.backgroundColor = bg;
  node.textContent = str;
  stream.appendChild(node);
}

function println(stream, str, fg = fgColor, bg = bgColor) {
  let splited = str.split('\n');
  for (s of splited) {
    let node = document.createElement('pre');
    node.style.color = fg;
    node.style.backgroundColor = bg;
    node.textContent = s;
    stream.appendChild(node);
    stream.appendChild(document.createElement('br'));
  }
}

function printURL(stream, href, fg = fgColor, bg = bgColor) {
  let node = document.createElement('a');
  node.style.color = fg;
  node.style.backgroundColor = bg;
  node.textContent = href;
  node.href = href;
  node.target = '_blank';
  stream.appendChild(node);
}

function print2018(args) {
  println(stdout, 'Cheers to 2018!')
  println(stdout, '  _______   ________     _____   ________     ');
  println(stdout, ' /  ___  \\ |\\   __  \\   / __  \\ |\\   __  \\    ');
  println(stdout, '/__/|_/  /|\\ \\  \\|\\  \\ |\\/_|\\  \\\\ \\  \\|\\  \\   ');
  println(stdout, '|__|//  / / \\ \\  \\\\\\  \\\\|/ \\ \\  \\\\ \\   __  \\  ');
  println(stdout, '    /  /_/__ \\ \\  \\\\\\  \\    \\ \\  \\\\ \\  \\|\\  \\ ');
  println(stdout, '   |\\________\\\\ \\_______\\    \\ \\__\\\\ \\_______\\');
  println(stdout, '    \\|_______| \\|_______|     \\|__| \\|_______|');
  println(stdout, '                                              ');
  println(stdout, '                                              ');
}

function whoami(args) {
  println(stdout, 'Name:\t\tEddie');
  println(stdout, 'Age:\t\t21');
  println(stdout, 'Country:\tJapan');
  println(stdout, 'Enroll:\t\tIwate Prefectural University');
}

function pwd(args) {
  println(stdout, env.pwd);
}

function cd(args) {
  let dest = args[1];
  let path = env.pwd.slice(1).split('/');
  if (path[0] === '') {
    path = [];
  }
  if (dest === '.') {
    return;
  } else if (dest === '..') {
    if (path.length > 1) {
      env.pwd = '/' + path.slice(0, path.length - 2).join('/');
    }
  } else if (dest === undefined || dest === '') {
    env.pwd = '/';
  } else {
    let exist = true;
    let head = dir['/'];
    for (let d of path) {
      if (typeof(head[d]) === 'object') {
        head = head[d];
      } else {
        exist = false;
        break;
      }
    }
    if (exist && typeof(head[dest]) ===  'object') {
      env.pwd += dest + '/';
    }
  }
}

function ls(args) {
  let path = env.pwd.slice(1).split('/');
  if (path[0] === '') {
    path = [];
  }
  let head = dir['/'];
  for (let d of path) {
    if (typeof(head[d]) === 'object') {
      head = head[d];
    }
  }
  println(stdout, ['.', '..'].concat(Object.keys(head)).join('  '));
}

function github(args) {
  print(stdout, 'My Github: ', 'yellow');
  printURL(stdout, 'https://github.com/tamamu', 'green');
  println(stdout, '');
}

function printPrompt() {
  print(stdout, '$ ');
}

function selectLast(editableElement) {
  let range = document.createRange();
  range.selectNodeContents(editableElement);
  range.collapse(false);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

class Command {
  constructor(execName, callback, description = '') {
    this.execName = execName;
    this.callback = callback;
    this.description = description;
  }
  run(args) {
    this.callback(args);
    printPrompt();
  }
}

class Shell {
  constructor() {
    this.bin = [];
    this.history = [];
    this.currentLine = 0;
  }
  regist(cmd) {
    this.bin[this.bin.length] = cmd;
  }
  help() {
    println(stdout, 'irish: commands:');
    for (let i=0; i<this.bin.length; i++) {
      let cmd = this.bin[i];
      println(stdout, cmd.execName+' - '+cmd.description);
    }
    printPrompt();
  }
  previous() {
    this.currentLine -= 1;
    if (this.currentLine < 0)
      this.currentLine = 0;
    return this.history[this.currentLine];
  }
  next() {
    this.currentLine += 1;
    if (this.currentLine >= this.history.length) {
      this.currentLine = this.history.length;
      return '';
    } else {
      return this.history[this.currentLine];
    }
  }
  appendHistory(input) {
    let execName = input.trim();
    if (execName === '') {
      return;
    } else {
      this.history.push(input);
      this.currentLine = this.history.length;
    }
  }
  exec(input) {
    let args = input.trim().split(' ');
    let execName = args[0];
    if (execName === '') {
      printPrompt();
      return;
    }
    if (execName === '?') {
      this.help();
      return;
    }

    let found = false;
    for (let cmd of this.bin) {
      if (cmd.execName === execName) {
        found = true;
        cmd.run(args);
        break;
      }
    }
    if (!found) {
      println(stdout, "irish: command not found: " + execName);
      printPrompt();
    }
  }
}

window.onload = () => {
  stdout = document.getElementById('stdout');
  let shell = new Shell();
  shell.regist(new Command('greeting', print2018, 'Print greeting message'));
  shell.regist(new Command('whoami', whoami, 'Display my profile'));
  shell.regist(new Command('github', github, 'Show my github URL'));
	shell.regist(new Command('pwd', pwd, 'Print working directory'));
  shell.regist(new Command('cd', cd, 'Change directory'));
  shell.regist(new Command('ls', ls, 'List directory contents'));
  let terminal = document.getElementById('terminal');
  terminal.onclick = (e) => {
    stdin.focus();
  }
  let stdin = document.getElementById('stdin');
  stdin.onkeydown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      shell.appendHistory(stdin.textContent);
      println(stdout, stdin.textContent);
      shell.exec(stdin.textContent);
      stdin.textContent = "";
      terminal.scrollTop = terminal.scrollTopMax;
    } else if (e.keyCode === 38) { // ↑
      e.preventDefault();
      stdin.textContent = shell.previous();
      selectLast(stdin);
      terminal.scrollTop = terminal.scrollTopMax;
    } else if (e.keyCode === 40) { // ↓
      e.preventDefault();
      stdin.textContent = shell.next();
      selectLast(stdin);
      terminal.scrollTop = terminal.scrollTopMax;
    }
  }
  stdin.focus();

  shell.exec('?');
}

console.log("%cHi! I'm Eddie. I love programming and software development. If you've been doing something fun, let me in!", 'font-size: 1.5em;color: #8e44ad');
