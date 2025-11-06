-- Grant usage to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO authenticated, anon;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated;

-- Enable realtime for messages table
ALTER publication supabase_realtime ADD TABLE messages;

