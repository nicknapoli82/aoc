const hexToBin = new Map([
  ['0', '0000'],
  ['1', '0001'],
  ['2', '0010'],
  ['3', '0011'],
  ['4', '0100'],
  ['5', '0101'],
  ['6', '0110'],
  ['7', '0111'],
  ['8', '1000'],
  ['9', '1001'],
  ['A', '1010'],
  ['B', '1011'],
  ['C', '1100'],
  ['D', '1101'],
  ['E', '1110'],
  ['F', '1111']
]);

class BitStream {
  constructor(stream) {
    this.stream = stream;
    this.cursor = 0;
    this.bits = [];
  }
  read(size) {
    while (this.bits.length < size && this.cursor < this.stream.length) {
      let bits = hexToBin.get(this.stream[this.cursor]);
      this.cursor++;
      for (let b of bits) {
        this.bits.push(Number.parseInt(b));
      }
    }
    if (this.bits.length < size) {
      console.log("Stream cannot satisfy size request");
      return null;
    }
    let result = this.bits.slice(0, size);
    this.bits = this.bits.slice(size);
    return result;
  }
}

class Packet {
  constructor(stream) {
    this.version = Number.parseInt(stream.read(3).join(''), 2);
    this.ID = Number.parseInt(stream.read(3).join(''), 2);
    this.bitsRead = 6;
    this.type = this.ID === 4 ? 'LITERAL' : 'OPERATOR';
    this.data = this.type === 'LITERAL' ? this.literalData(stream) : this.operatorData(stream);
    return this;
  }

  literalData(stream) {
    let bitsRead = stream.read(5);
    this.bitsRead += bitsRead.length;
    let value = 0;
    while (bitsRead !== null && bitsRead[0] === 1) {
      value = (value * 16) + Number.parseInt(bitsRead.slice(1).join(''), 2);
      bitsRead = stream.read(5);
      this.bitsRead += bitsRead.length;
    }
    return (value * 16) + Number.parseInt(bitsRead.slice(1).join(''), 2);
  }

  operatorData(stream) {
    let lengthField = stream.read(1)[0] === 0 ? 15 : 11;
    let length = Number.parseInt(stream.read(lengthField).join(''), 2);
    this.bitsRead += 1 + lengthField;
    let dataPackets = [];
    while (length > 0) {
      dataPackets.push(new Packet(stream));
      this.bitsRead += dataPackets[dataPackets.length - 1].bitsRead;
      length -= lengthField === 15 ? dataPackets[dataPackets.length - 1].bitsRead : 1;
    }
    return dataPackets;
  }
}

function addVersionNumbers(packet) {
  let result = packet.version;
  if (packet.type === 'OPERATOR') {
    for (let p of packet.data) {
      if (packet.type === 'OPERATOR') {
        result += addVersionNumbers(p);
      }
      else
        result += p.version;
    }
  }
  return result;
}

function evalExp(packet) {
  switch (packet.ID) {
    case 0:  // SUM
      {
        return packet.data.reduce((acc, e) => acc += evalExp(e), 0);
      };
    case 1:  // PRODUCT
      {
        return packet.data.reduce((acc, e) => acc *= evalExp(e), 1);
      };
    case 2:  // MINIMUM
      {
        return packet.data.reduce((acc, e) => {
          e = evalExp(e);
          return e < acc ? e : acc;
        }, Infinity);
      };
    case 3:  // MINIMUM
      {
        return packet.data.reduce((acc, e) => {
          e = evalExp(e);
          return e > acc ? e : acc;
        }, 0);
      };
    case 4:  // LITERAL
      { return packet.data; }
    case 5:  // GTR THAN
      {
        let lhs = evalExp(packet.data[0]);
        let rhs = evalExp(packet.data[1]);
        return lhs > rhs ? 1 : 0;
      };
    case 6:  // LESS THAN
      {
        let lhs = evalExp(packet.data[0]);
        let rhs = evalExp(packet.data[1]);
        return lhs < rhs ? 1 : 0;
      };
    case 7:  // EQUAL
      {
        let lhs = evalExp(packet.data[0]);
        let rhs = evalExp(packet.data[1]);
        return lhs === rhs ? 1 : 0;
      };
    default: {
      console.log("Something went wrong. Invalid packet ID. Quitting");
      process.exit(1);
    };
  }
}

let fs = require('fs');
let input = fs.readFileSync('input').toString().split('');
let transmission = new BitStream(input);
let packet = new Packet(transmission);
console.log(addVersionNumbers(packet));
console.log(evalExp(packet));
