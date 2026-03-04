-- ================================================
-- Schema para: Luiza Sp - Site Admin Panel
-- Cole este SQL no SQL Editor do Supabase:
-- Dashboard → SQL Editor → New Query → Cole → Run
-- ================================================

-- Tabela principal de configuração do site
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  previews JSONB NOT NULL DEFAULT '{}'::jsonb,
  admin_password TEXT NOT NULL DEFAULT 'admin123',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Inserir linha padrão (só uma linha sempre)
INSERT INTO site_config (id, profile, stats, plans, settings, previews, admin_password)
VALUES (
  'main',
  '{
    "displayName": "Luiza Sp",
    "bio": "Conteúdo exclusivo que você não encontra em nenhum outro lugar 🖤",
    "lockedMessage": "Conteúdo exclusivo para assinantes",
    "profileImage": null,
    "bannerImage": null
  }'::jsonb,
  '{
    "posts": 248,
    "subscribers": "1.2k",
    "mediaCount": 47
  }'::jsonb,
  '[
    {"id":"basic","name":"Básico","price":"14,90","icon":"zap","features":["Conteúdos leves e exclusivos","Acesso inicial ao perfil","Atualizações semanais"],"featured":false,"label":"","checkoutUrl":"http://app.syncpayments.com.br/payment-link/a114f2a4-b230-44e2-b554-08f9bdc891f0","active":true},
    {"id":"plus","name":"Plus","price":"30,90","icon":"star","features":["Conteúdos mais completos e frequentes","Vídeos exclusivos","Acesso a fotos inéditas"],"featured":false,"label":"","checkoutUrl":"http://app.syncpayments.com.br/payment-link/a114f39e-f558-4bc7-9ef5-c28664b16497","active":true},
    {"id":"vip","name":"VIP","price":"60,90","icon":"crown","features":["Conteúdos premium e explícitos","Vídeos longos e exclusivos","Drops semanais VIP","Prioridade no atendimento"],"featured":true,"label":"Mais escolhido","checkoutUrl":"http://app.syncpayments.com.br/payment-link/a114f78d-6482-425e-bfab-4d41ffbab210","active":true},
    {"id":"elite","name":"Elite","price":"157,90","icon":"gem","features":["Acesso total e ilimitado","Conteúdos ultra exclusivos","Materiais que não vão para outros planos","Experiência máxima e privada"],"featured":true,"label":"Exclusivo","checkoutUrl":"http://app.syncpayments.com.br/payment-link/a114f888-c68b-4410-91fc-1049f33a09f2","active":true}
  ]'::jsonb,
  '{
    "ageRestriction": 18,
    "showSubscriberCount": true,
    "showMediaCount": true
  }'::jsonb,
  '{"images":[null,null,null]}'::jsonb,
  'admin123'
)
ON CONFLICT (id) DO NOTHING;

-- Política de segurança Row Level Security (RLS)
-- Habilitar RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode LER (a página pública precisa ler)
CREATE POLICY "Leitura pública" ON site_config
  FOR SELECT USING (true);

-- Qualquer um pode ATUALIZAR (o admin panel precisa salvar)
-- Em produção você pode restringir isso com autenticação real
CREATE POLICY "Escrita pública" ON site_config
  FOR UPDATE USING (true);
