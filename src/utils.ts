import assert from "node:assert";

export function average(array: bigint[]): bigint {
  if (array.length === 0) return 0n;

  const sum = array.reduce((acc, val) => acc + val, 0n);
  return sum / BigInt(array.length);
}

export function median(array: bigint[]): bigint {
  if (array.length === 0) return 0n;

  if (array.length === 1) return array.at(0)!;

  const sorted = [...array].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    const value = sorted.at(middleIndex);
    assert(typeof value !== "undefined");

    return value;
  }

  const first = sorted.at(middleIndex - 1);
  assert(typeof first !== "undefined");

  const second = sorted.at(middleIndex);
  assert(typeof second !== "undefined");

  return (first + second) / 2n;
}
