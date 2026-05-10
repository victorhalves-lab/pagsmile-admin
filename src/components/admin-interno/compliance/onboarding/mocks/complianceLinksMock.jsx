// Mock para a página de Links de Compliance

export const mockComplianceLinks = Array.from({ length: 12 }, (_, i) => {
  const types = ['PIX', 'FULL', 'LITE', 'ECOMMERCE', 'SAAS', 'GENERIC'];
  const agents = ['Ana Silva', 'Carlos Lima', 'Júlia Costa', 'Pedro Souza'];
  const utms = ['google', 'meta', 'linkedin', 'direct', null];
  const clicks = Math.floor(Math.random() * 200) + 10;
  const submissions = Math.floor(Math.random() * clicks * 0.6);
  const completed = Math.floor(submissions * (0.5 + Math.random() * 0.4));
  return {
    id: `link_${i + 1}`,
    uniqueCode: `CMP-${String(20260000 + i * 137).padStart(8, '0')}`,
    complianceType: types[i % types.length],
    commercialAgentName: agents[i % agents.length],
    utmSource: utms[i % utms.length],
    clickCount: clicks,
    submissionCount: submissions,
    completedCount: completed,
    created_date: new Date(Date.now() - i * 3 * 24 * 3600 * 1000).toISOString(),
  };
});