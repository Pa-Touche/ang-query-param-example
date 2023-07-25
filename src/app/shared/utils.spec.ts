import { exctractLeafProperties, getLeafValuePairs, keyValuePairsToObject } from "./utils";


describe('exctractLeafProperties', () => {
  it('should extract leaf properties from the object', () => {
    const obj = {
      d: {
        e: {
          f: 'value1'
        },
        g: 'value2',
      },
      h: 'value3'
    };

    const result = exctractLeafProperties(obj);
    expect(result).toEqual(['d.e.f', 'd.g', 'h']);
  });

  it('should return an empty array for an empty object', () => {
    const obj = {};
    const result = exctractLeafProperties(obj);
    expect(result).toEqual([]);
  });

  it('should handle arrays as leaf properties', () => {
    const obj = {
      a: [1, 2, 3],
      b: 'value',
      c: {
        d: [4, 5]
      }
    };

    const result = exctractLeafProperties(obj);
    expect(result).toEqual(['a', 'b', 'c.d']);
  });

  it('should handle deeply nested objects', () => {
    const obj = {
      a: {
        b: {
          c: {
            d: 'value'
          }
        }
      }
    };

    const result = exctractLeafProperties(obj);
    expect(result).toEqual(['a.b.c.d']);
  });

  it('should handle an object with multiple leaf properties', () => {
    const obj = {
      a: 'value1',
      b: 'value2',
      c: 'value3'
    };

    const result = exctractLeafProperties(obj);
    expect(result).toEqual(['a', 'b', 'c']);
  });
});

describe('getLeafValuePairs', () => {
  it('should return an array of key-value pairs for leaf properties', () => {
    const obj = {
      a: 'value1',
      b: {
        c: 'value2',
        d: {
          e: 'value3'
        }
      },
      f: [1, 2, 3],
      g: true
    };

    const result = getLeafValuePairs(obj);
    expect(result).toEqual([
      ['a', 'value1'],
      ['b.c', 'value2'],
      ['b.d.e', 'value3'],
      ['f', [1, 2, 3]],
      ['g', true]
    ]);
  });

  it('should return an empty array for an empty object', () => {
    const obj = {};
    const result = getLeafValuePairs(obj);
    expect(result).toEqual([]);
  });

  it('should handle arrays as leaf properties', () => {
    const obj = {
      a: [1, 2, 3],
      b: 'value',
      c: {
        d: [4, 5]
      }
    };

    const result = getLeafValuePairs(obj);
    expect(result).toEqual([
      ['a', [1, 2, 3]],
      ['b', 'value'],
      ['c.d', [4, 5]]
    ]);
  });

  it('should handle deeply nested objects', () => {
    const obj = {
      a: {
        b: {
          c: {
            d: 'value'
          }
        }
      }
    };

    const result = getLeafValuePairs(obj);
    expect(result).toEqual([['a.b.c.d', 'value']]);
  });

  it('should handle an object with multiple leaf properties', () => {
    const obj = {
      a: 'value1',
      b: 'value2',
      c: 'value3'
    };

    const result = getLeafValuePairs(obj);
    expect(result).toEqual([
      ['a', 'value1'],
      ['b', 'value2'],
      ['c', 'value3']
    ]);
  });
});


describe('keyValuePairsToObject', () => {


  it('should handle nested properties, arrays and booleans', () => {
    const keyValuePairs = [
      ['a', 'value1'],
      ['b.c', 'value2'],
      ['b.d.e', 'value3'],
      ['f', [1, 2, 3]],
      ['g', true]
    ];

    // not quite sure why typing is broken ?
    const result = keyValuePairsToObject(keyValuePairs as any);

    expect(result).toEqual(
      {
        a: 'value1',
        b: { c: 'value2', d: { e: 'value3' } },
        f: [ 1, 2, 3 ],
        g: true
      }
    );
  });
});
