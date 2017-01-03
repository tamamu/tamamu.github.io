/* ----------------------------- */
/*   Tamamu's Portfolio Script   */
/*         (c) 2017 Tamamu       */
/* ----------------------------- */

let stdout;
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

function print2017() {
  println(stdout, 'A Happy New Year!\n\
  _______  ________    _____   ________  \n\
 /  ___  \\|\\   __  \\  / __  \\ |\\_____  \\ \n\
/__/|_/  /\\ \\  \\|\\  \\|\\/_|\\  \\ \\|___/  /|\n\
|__|//  / /\\ \\  \\\\\\  \\|/ \\ \\  \\    /  / /\n\
    /  /_/__\\ \\  \\\\\\  \\   \\ \\  \\  /  / / \n\
   |\\________\\ \\_______\\   \\ \\__\\/__/ /  \n\
    \\|_______|\\|_______|    \\|__||__|/   \n');
}

function whoami() {
  println(stdout, 'Tamamu a.k.a. Hidetoshi ITO');
  println(stdout, 'Age:\t\t20');
  println(stdout, 'Country:\tJapan');
  println(stdout, 'Enroll:\t\tIwate Prefectural University');
}

function github() {
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
  run() {
    this.callback();
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
    let execName = input.trim();
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
        cmd.run();
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
  shell.regist(new Command('greeting', print2017, 'Print greeting message'));
  shell.regist(new Command('whoami', whoami, 'Display my profile'));
  shell.regist(new Command('github', github, 'Show my github URL'));
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