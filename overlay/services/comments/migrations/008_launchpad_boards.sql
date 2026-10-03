-- Startup-type specific LaunchPad forum boards
INSERT INTO forum_boards (slug, label, description, icon, requires_auth, sort_order)
VALUES
  ('founders-general', 'Founders General', 'All founders welcome', 'rocket_launch', TRUE, 10),
  ('saas-founders', 'SaaS Founders', 'Software as a Service discussion', 'cloud', TRUE, 11),
  ('marketplace-founders', 'Marketplace Founders', 'Two-sided marketplace discussion', 'storefront', TRUE, 12),
  ('ecommerce-founders', 'eCommerce Founders', 'Online retail and D2C', 'shopping_cart', TRUE, 13),
  ('services-founders', 'Services Founders', 'Consulting and professional services', 'handshake', TRUE, 14),
  ('fintech-founders', 'Fintech Founders', 'Finance and payments', 'account_balance', TRUE, 15),
  ('health-founders', 'Health Founders', 'HealthTech and wellness', 'favorite', TRUE, 16),
  ('content-founders', 'Content Founders', 'Media, content, and creator economy', 'article', TRUE, 17)
ON CONFLICT (slug) DO NOTHING;
