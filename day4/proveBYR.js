const validBYR = ({ byr }) => byr.length === 4 && byr >= 1920 && byr <= 2002;
const validHGT = (hgt) => {
  let height = parseInt(hgt, 10);
  let unit = hgt.match(/[a-z]+/i)[0];
  if (unit === 'cm' && height >= 150 && height <= 193)
    return true;
  if (unit === 'in' && height >= 59 && height <= 76)
    return true;
  return false;
};

const invalidHGT = ['194cm', '149cm', '58in', '77in', '193cm', '150cm', '59in', '76in'];

for (let i of invalidHGT) {
  if (!validHGT(i))
    console.log(`${i} is invalid`);
}
