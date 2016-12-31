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

function printPrompt() {
  print(stdout, '$ ');
}

class Command {
  constructor(execName, callback) {
    this.execName = execName;
    this.callback = callback;
  }
  run() {
    this.callback();
    printPrompt();
  }
}

class Shell {
  constructor() {
    this.bin = [];
  }
  regist(cmd) {
    this.bin[this.bin.length] = cmd;
  }
  exec(input) {
    if (input === '') {
      printPrompt();
      return;
    }

    let found = false;
    for (let cmd of this.bin) {
      if (cmd.execName === input) {
        found = true;
        cmd.run();
        break;
      }
    }
    if (!found) {
      println(stdout, "irish: command not found: " + input);
      printPrompt();
    }
  }
}

window.onload = () => {
  stdout = document.getElementById('stdout');
  let shell = new Shell();
  shell.regist(new Command('greeting', print2017));
  let terminal = document.getElementById('terminal');
  terminal.onclick = (e) => {
    stdin.focus();
  }
  let stdin = document.getElementById('stdin');
  stdin.onkeydown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      println(stdout, stdin.textContent);
      shell.exec(stdin.textContent);
      stdin.textContent = "";
    }
  }
  stdin.focus();

  shell.exec("greeting");
}