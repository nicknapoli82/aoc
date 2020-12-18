const beginTime = process.hrtime();
const { readFileSync } = require('fs');
class Machine {
  constructor(instructions) {
    this.registers = {
      acc: 0,
      instructionPointer: 0,
    };
    this.memory = {
      byteCode: instructions,
      memory: []
    };
    this.cpuState = {
      halt: false
    };
  }
  readInstruction = (instruction) => {
    let [op, value] = instruction.split(' ');
    return { op, value: Number(value) };
  };
  executeInstruction = () => {
    let { op, value } = this.readInstruction(this.memory.byteCode[this.registers.instructionPointer]);
    switch (op) {
      case 'nop':
        this.registers.instructionPointer++;
        break;
      case 'acc':
        this.registers.acc += value;
        this.registers.instructionPointer++;
        break;
      case 'jmp':
        this.registers.instructionPointer += value;
        break;
    }
  };
  cycle = () => {
    if (!this.cpuState.halt)
      this.executeInstruction();
    if (this.registers.instructionPointer === this.memory.byteCode.length)
      this.cpuState.halt = true;
  };
  reboot = () => {
    this.registers.acc = 0;
    this.registers.instructionPointer = 0;
    this.cpuState.halt = false;
    this.memory = [];
  };
  inspect = (specifier = null) => {
    if (!specifier) return this;
    return this[specifier];
  };
};

// Star 1
const handheld = new Machine(readFileSync('input', 'utf8').split('\n'));
const alreadyRan = (new Set());
while (!alreadyRan.has(handheld.inspect('registers').instructionPointer)) {
  alreadyRan.add(handheld.inspect('registers').instructionPointer);
  handheld.cycle();
}
console.log(handheld.inspect('registers').acc);

// Star 2
class HackedMachine extends Machine {
  constructor(instructions) {
    super(instructions);
  }
  getOP = () => {
    let [op, value] = this.memory.byteCode[this.registers.instructionPointer].split(' ');
    return op;
  };
  inject = (lookAhead) => {
    let [op, value] = this.memory.byteCode[this.registers.instructionPointer].split(' ');
    switch (lookAhead) {
      case 'nop':
        this.memory.byteCode[this.registers.instructionPointer] = `jmp ${value}`;
        return;
      case 'jmp':
        this.memory.byteCode[this.registers.instructionPointer] = `nop ${value}`;
        return;
      default: return;
    }
  };
  saveState = () => {
    this.saveState.registers = { ...this.registers };
    this.saveState.cpuState = { ...this.cpuState.halt };
    this.saveState.memory = { byteCode: [...this.memory.byteCode], memory: [...this.memory.memory] };
  };
  loadState = () => {
    this.registers = { ...this.saveState.registers };
    this.cpuState = { ...this.saveState.cpuState };
    this.memory = { byteCode: [...this.saveState.memory.byteCode], memory: [...this.saveState.memory.memory] };
  };
}

const hacked = new HackedMachine(readFileSync('input', 'utf8').split('\n'));
alreadyRan.clear();
while (!hacked.inspect('cpuState').halt) {
  let lookAhead = hacked.getOP();
  if (lookAhead === 'nop' || lookAhead === 'jmp') {
    hacked.saveState();
    const ranClone = new Set(alreadyRan);
    hacked.inject(lookAhead);
    while (!ranClone.has(hacked.inspect('registers').instructionPointer) && !hacked.inspect('cpuState').halt) {
      ranClone.add(hacked.inspect('registers').instructionPointer);
      hacked.cycle();
    }
    if (hacked.inspect('cpuState').halt) break;
    else hacked.loadState();
  }
  alreadyRan.add(hacked.inspect('registers').instructionPointer);
  hacked.cycle();
}
console.log(hacked.inspect('registers').acc);
const endTime = process.hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
