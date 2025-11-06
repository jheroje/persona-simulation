ALTER TABLE "achievements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assessments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "simulations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "achievements_select_own" ON "achievements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("achievements"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "achievements_insert_own" ON "achievements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("achievements"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "assessments_select_by_simulation" ON "assessments" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "simulations"
        WHERE "simulations"."id" = "assessments"."simulation_id"
          AND "simulations"."user_id" = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "assessments_insert_by_simulation" ON "assessments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "simulations"
        WHERE "simulations"."id" = "assessments"."simulation_id"
          AND "simulations"."user_id" = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "messages_select_by_simulation" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "simulations"
        WHERE "simulations"."id" = "messages"."simulation_id"
          AND "simulations"."user_id" = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "messages_insert_by_simulation" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "simulations"
        WHERE "simulations"."id" = "messages"."simulation_id"
          AND "simulations"."user_id" = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "simulations_select_own" ON "simulations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("simulations"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "simulations_insert_own" ON "simulations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("simulations"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "simulations_update_own" ON "simulations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("simulations"."user_id" = auth.uid()) WITH CHECK ("simulations"."user_id" = auth.uid());