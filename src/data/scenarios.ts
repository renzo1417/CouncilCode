import { CodeScenario, CodeFinding } from '@/types/council';

export const INVOICE_IDOR_SCENARIO: CodeScenario = {
  id: 'invoice-idor',
  title: 'Secure Invoice Access Endpoint (IDOR Vulnerability)',
  summary:
    'An enterprise billing service exposes GET /api/v1/invoices/:id. While basic unit tests pass, the handler fails to enforce tenant isolation, allowing User A to query User B’s private invoice.',
  vulnerabilityType: 'CWE-639 / OWASP API1:2023 - Broken Object Level Authorization',
  filePath: 'src/api/routes/invoices.ts',
  initialCode: `import { Router, Request, Response } from 'express';
import { db } from '@/database/client';
import { requireAuth } from '@/middleware/auth';

export const invoiceRouter = Router();

// GET /api/v1/invoices/:id
// Task: Fetch customer billing invoice details
invoiceRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  // Query database by primary key ID
  const invoice = await db.invoices.findUnique({
    where: { id },
    include: { lineItems: true, customer: true }
  });

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  // Vulnerability: Missing tenant ownership verification.
  // Any authenticated user can read any invoice by guessing or iterating IDs.
  return res.status(200).json({ invoice });
});`,

  patchedCode: `import { Router, Request, Response } from 'express';
import { db } from '@/database/client';
import { requireAuth } from '@/middleware/auth';
import { ForbiddenError, NotFoundError } from '@/errors';

export const invoiceRouter = Router();

// GET /api/v1/invoices/:id
// Verified: Strict tenant isolation and ownership assertion
invoiceRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userOrgId = req.user?.organizationId;

  if (!userOrgId) {
    throw new ForbiddenError('Missing organization context in auth session');
  }

  const invoice = await db.invoices.findUnique({
    where: { id },
    include: { lineItems: true, customer: true }
  });

  if (!invoice) {
    throw new NotFoundError(\`Invoice '\${id}' not found\`);
  }

  // CouncilCode verified fix:
  // Enforce tenant boundary. Cross-tenant access throws 403 Forbidden.
  if (invoice.organizationId !== userOrgId) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access to foreign organization invoice is denied'
    });
  }

  return res.status(200).json({ invoice });
});`,

  baselineTestCode: `describe('GET /api/v1/invoices/:id (Baseline Suite)', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/v1/invoices/inv_123');
    expect(res.status).toBe(401);
  });

  it('returns 404 when invoice does not exist', async () => {
    const token = createTestToken({ orgId: 'org_alpha' });
    const res = await request(app)
      .get('/api/v1/invoices/inv_nonexistent')
      .set('Authorization', \`Bearer \${token}\`);
    expect(res.status).toBe(404);
  });

  it('returns 200 with invoice data when authenticated', async () => {
    const token = createTestToken({ orgId: 'org_alpha' });
    const res = await request(app)
      .get('/api/v1/invoices/inv_alpha_01')
      .set('Authorization', \`Bearer \${token}\`);
    expect(res.status).toBe(200);
    expect(res.body.invoice.id).toBe('inv_alpha_01');
  });
});`,

  exploitTestCode: `import request from 'supertest';
import { app } from '@/app';
import { createTestToken } from '@/test/helpers';

describe('REGRESSION TEST: Tenant Isolation (CWE-639)', () => {
  it('strictly rejects access when User from Org B requests Org A invoice', async () => {
    // Target invoice belongs to Org Alpha
    const targetInvoiceId = 'inv_org_alpha_private_99';

    // Attacker token belongs to Org Beta
    const attackerToken = createTestToken({
      userId: 'usr_beta_attacker',
      organizationId: 'org_beta_hacker'
    });

    const response = await request(app)
      .get(\`/api/v1/invoices/\${targetInvoiceId}\`)
      .set('Authorization', \`Bearer \${attackerToken}\`);

    // CouncilCode Assertion: MUST be rejected with HTTP 403 Forbidden
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Forbidden');
    expect(response.body.invoice).toBeUndefined();
  });
});`
};

export const INITIAL_FINDINGS: CodeFinding[] = [
  {
    id: 'finding-sec-01',
    criticId: 'critic-claude',
    criticName: 'Claude Sentinel',
    criticRole: 'security',
    model: 'anthropic',
    title: 'Missing Organization / Tenant Check allows BOLA/IDOR',
    cweCode: 'CWE-639: Insecure Direct Object References',
    description:
      'The route handler queries invoices by primary key "id" without validating that invoice.organizationId matches the requester’s req.user.organizationId. An authenticated tenant can access confidential financial documents of rival tenants.',
    affectedFile: 'src/api/routes/invoices.ts',
    affectedLineRange: 'L18-L23',
    affectedCode: 'const invoice = await db.invoices.findUnique({ where: { id } });\nreturn res.status(200).json({ invoice });',
    proposedAssertion: `it('blocks cross-tenant access with 403', async () => {
  const tokenOrgB = createToken({ org: 'org-beta' });
  const res = await get('/api/v1/invoices/inv-org-alpha').auth(tokenOrgB);
  expect(res.status).toBe(403);
});`,
    proofStatus: 'untested',
    sandboxOutput: '',
    arbitrationOutcome: 'pending',
    arbitrationReason: ''
  },
  {
    id: 'finding-logic-02',
    criticId: 'critic-deepseek',
    criticName: 'DeepSeek Logic',
    criticRole: 'logic',
    model: 'deepseek',
    title: 'State Invariant Check: Auth context null-coalescing check',
    description:
      'Validates that req.user is guaranteed non-null before attempting property access on organizationId to prevent unhandled runtime TypeError in production.',
    affectedFile: 'src/api/routes/invoices.ts',
    affectedLineRange: 'L46-L51',
    affectedCode: 'const userOrgId = req.user?.organizationId;\nif (!userOrgId) throw new ForbiddenError(...);',
    proposedAssertion: `it('enforces present organization context in auth session', async () => {
  const tokenNoOrg = createToken({ org: null });
  const res = await get('/api/v1/invoices/inv_123').auth(tokenNoOrg);
  expect(res.status).toBe(403);
});`,
    proofStatus: 'untested',
    sandboxOutput: '',
    arbitrationOutcome: 'pending',
    arbitrationReason: ''
  },
  {
    id: 'finding-style-03',
    criticId: 'critic-gpt',
    criticName: 'CodeCraft Style',
    criticRole: 'style',
    model: 'openai',
    title: 'Suggestion: Rewrite handler using FP pipes & rename invoice variable',
    description:
      'Subjective recommendation: avoid async/await in Express handlers and rewrite with TaskEither or fp-ts pipe. Also consider renaming "invoice" to "billingDocumentRecord".',
    affectedFile: 'src/api/routes/invoices.ts',
    affectedLineRange: 'L10-L15',
    affectedCode: 'invoiceRouter.get("/:id", requireAuth, async (req, res) => ...)',
    proposedAssertion: `// No executable failure or test provided
// Assertion: "Code readability score should be higher"`,
    proofStatus: 'untested',
    sandboxOutput: 'Proof Gate: No executable test provided or zero assertion delta. Rejection criterion met.',
    arbitrationOutcome: 'pending',
    arbitrationReason: ''
  }
];
