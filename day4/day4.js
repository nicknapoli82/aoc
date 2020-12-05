const beginTime = process.hrtime();
const fs = require('fs');

const requiredFieldsList = new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid']);

function keyValue(str) {
  let s = str.split(':');
  return { key: s[0], value: s[1] };
}

function Passport(fields) {
  for (let f of fields) { this[f.key] = f.value; }
  this.isValid = (...using) => {
    for (let validate of using) {
      if (!validate(this)) {
        return false;
      }
    }
    return true;
  };
  return this;
}

// Passport validations
const allKeysValid = (fields) => {
  for (let required of requiredFieldsList) {
    if (!fields[required]) return false;
  }
  return true;
};
const allKeysValidHacked = (fields) => {
  for (let required of requiredFieldsList) {
    if (!fields[required] && required != 'cid') return false;
  }
  return true;
};

const validBYR = ({ byr }) => byr.length === 4 && byr >= 1920 && byr <= 2002;
const validIYR = ({ iyr }) => iyr.length === 4 && iyr >= 2010 && iyr <= 2020;
const validEYR = ({ eyr }) => eyr.length === 4 && eyr >= 2020 && eyr <= 2030;
const validHGT = ({ hgt }) => {
  let height = parseInt(hgt, 10);
  let unit = hgt.match(/[a-z]+/i);
  if (unit) unit = unit[0];
  if (unit === 'cm' && height >= 150 && height <= 193)
    return true;
  if (unit === 'in' && height >= 59 && height <= 76)
    return true;
  return false;
};
const validHCL = ({ hcl }) => {
  if (hcl.length !== 7) return false;
  if (hcl.match(/#([a-f0-9]+)/i))
    return true;
  return false;
};
const validECL = ({ ecl }) => {
  let eclSet = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);
  if (eclSet.has(ecl))
    return true;
  return false;
};
const validPID = ({ pid }) => {
  if (pid.length !== 9) return false;
  if (pid.match(/[0-9]+/g))
    return true;
  return false;
};
const validCID = ({ cid }) => {
  return true; // ignored
};

let passports = [];

let input = fs.readFileSync('input', 'utf8');
input = input.split('\n');

let totalPassports = 0;
let legitPassports = 0;
let hackedPassports = 0;
let tightenedSecurity = 0;
while (input.length) {
  let passportFields = [];
  totalPassports++;
  for (let fields = input.pop(); fields !== '' && fields !== undefined; fields = input.pop()) {
    fields = fields.split(' ');
    for (let kv of fields) {
      passportFields.push(keyValue(kv));
    }
  }
  if (passportFields.length) {
    let passport = new Passport(passportFields);
    if (passport.isValid(allKeysValidHacked)) {
      hackedPassports++;
    }
    if (passport.isValid(allKeysValid)) {
      legitPassports++;
    }
    if (passport.isValid(allKeysValidHacked, validBYR, validIYR, validEYR, validHGT, validHCL, validECL, validPID)) {
      tightenedSecurity++;
    }
    passports.push(passport);
  }
}

console.log(`Total Passports     = ${totalPassports}`);
console.log(`Legit Passports     = ${legitPassports}`);
console.log(`Hacked Passports    = ${hackedPassports}`);
console.log(`Tightened Passports = ${tightenedSecurity}`);

const endTime = process.hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
