import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

// Guards the machine-enforced "never weaken tests" rules in eslint.config.js.
const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

async function errorRules(code: string, filePath: string) {
  const [result] = await eslint.lintText(code, { filePath })
  return result.messages.filter((m) => m.severity === 2).map((m) => m.ruleId)
}

const UNIT = 'src/zz.test.tsx'
const E2E = 'e2e/zz.spec.ts'

const unitPatterns = [
  "describe.skip('x', () => {})",
  "describe.only('x', () => {})",
  "describe.todo('x')",
  "it.skip('x', () => {})",
  "it.only('x', () => {})",
  "it.todo('x')",
  "test.skip('x', () => {})",
  "test.only('x', () => {})",
  "test.todo('x')",
  "xit('x', () => {})",
  "xdescribe('x', () => {})",
  "it.skipIf(true)('x', () => {})",
  "it('x', ({ skip }) => { skip() })",
]

const e2ePatterns = [
  "test.skip('x', async () => {})",
  "test.only('x', async () => {})",
  "test.fixme('x', async () => {})",
  "test.describe.skip('x', () => {})",
  "test.describe.only('x', () => {})",
  "test.describe.fixme('x', () => {})",
  "test('x', async () => { test.skip() })",
  "test('x', async () => { test.fixme() })",
]

describe('test-integrity lint rules', () => {
  it.each(unitPatterns)('rejects unit test pattern: %s', async (code) => {
    expect(await errorRules(code, UNIT)).not.toHaveLength(0)
  })

  it.each(e2ePatterns)('rejects e2e pattern: %s', async (code) => {
    const source = `import { test } from '@playwright/test'\n${code}`
    expect(await errorRules(source, E2E)).not.toHaveLength(0)
  })

  it.each([
    [
      'unit',
      UNIT,
      "// eslint-disable-next-line vitest/no-disabled-tests\nit.skip('x', () => {})",
    ],
    ['unit', UNIT, "/* eslint-disable */\nit.only('x', () => {})"],
    [
      'e2e',
      E2E,
      "// eslint-disable-next-line playwright/no-skipped-test\ntest.skip('x', async () => {})",
    ],
  ])('rejects disable comments (%s)', async (_kind, file, code) => {
    const rules = await errorRules(code, file)
    expect(rules).toContain(
      '@eslint-community/eslint-comments/no-restricted-disable',
    )
  })

  it('accepts a normal test', async () => {
    expect(await errorRules("it('x', () => {})", UNIT)).toEqual([])
  })
})
