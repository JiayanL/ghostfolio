import * as fs from 'fs';
import * as path from 'path';

describe('PortfolioPosition interface', () => {
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(
      path.join(__dirname, 'portfolio-position.interface.ts'),
      'utf-8'
    );
  });

  describe('Deprecated fields migration path documentation', () => {
    const deprecatedFields = [
      'assetClass',
      'assetClassLabel',
      'assetSubClass',
      'assetSubClassLabel',
      'countries',
      'currency',
      'dataSource',
      'holdings',
      'name',
      'sectors',
      'symbol',
      'url'
    ];

    it.each(deprecatedFields)(
      'should document migration path for deprecated field "%s"',
      (field) => {
        const pattern = new RegExp(
          `@deprecated[^*]*assetProfile[^*]*\\.${field}[^*]*instead[\\s\\S]*?\\b${field}[?]?:`
        );

        expect(source).toMatch(pattern);
      }
    );

    it('should have migration path for all deprecated fields', () => {
      const bareDeprecatedPattern = /\/\*\*\s*@deprecated\s*\*\//g;
      const bareMatches = source.match(bareDeprecatedPattern);

      expect(bareMatches).toBeNull();
    });
  });
});
