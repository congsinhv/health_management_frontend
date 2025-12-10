declare module 'minimatch' {
  interface MinimatchOptions {
    nobrace?: boolean;
    noglobstar?: boolean;
    dot?: boolean;
    noext?: boolean;
    nocase?: boolean;
    matchBase?: boolean;
    flipNegate?: boolean;
    partial?: boolean;
  }

  function minimatch(
    target: string,
    pattern: string,
    options?: MinimatchOptions
  ): boolean;

  namespace minimatch {
    function filter(
      pattern: string,
      options?: MinimatchOptions
    ): (element: string) => boolean;
    function match(
      list: string[],
      pattern: string,
      options?: MinimatchOptions
    ): string[];
    function makeRe(
      pattern: string,
      options?: MinimatchOptions
    ): RegExp | false;
    class Minimatch {
      constructor(pattern: string, options?: MinimatchOptions);
      match(fname: string): boolean;
    }
  }

  export = minimatch;
}
