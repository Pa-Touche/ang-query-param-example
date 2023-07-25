import { exctractLeafProperties } from "./utils";


describe('exctractLeafProperties', () => {
  it('should extract leaf properties from the object', () => {
    const obj = {
      d: {
        e: {
          f: 'value1'
        },
        g: 'value2'
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
