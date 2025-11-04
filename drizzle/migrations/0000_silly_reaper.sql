CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"simulation_id" uuid NOT NULL,
	CONSTRAINT "achievements_user_id_badge_type_unique" UNIQUE("user_id","badge_type")
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulation_id" uuid NOT NULL,
	"score" smallint NOT NULL,
	"time_to_resolve" interval NOT NULL,
	"criteria_feedback" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assessments_simulation_id_unique" UNIQUE("simulation_id"),
	CONSTRAINT "score_range" CHECK ("assessments"."score" >= 0 AND "assessments"."score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"simulation_id" uuid NOT NULL,
	"sender" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"tone" text NOT NULL,
	"ocean_openness" smallint NOT NULL,
	"ocean_conscientiousness" smallint NOT NULL,
	"ocean_extraversion" smallint NOT NULL,
	"ocean_agreeableness" smallint NOT NULL,
	"ocean_neuroticism" smallint NOT NULL,
	"scenarios" jsonb NOT NULL,
	CONSTRAINT "ocean_openness_range" CHECK ("personas"."ocean_openness" >= 0 AND "personas"."ocean_openness" <= 100),
	CONSTRAINT "ocean_conscientiousness_range" CHECK ("personas"."ocean_conscientiousness" >= 0 AND "personas"."ocean_conscientiousness" <= 100),
	CONSTRAINT "ocean_extraversion_range" CHECK ("personas"."ocean_extraversion" >= 0 AND "personas"."ocean_extraversion" <= 100),
	CONSTRAINT "ocean_agreeableness_range" CHECK ("personas"."ocean_agreeableness" >= 0 AND "personas"."ocean_agreeableness" <= 100),
	CONSTRAINT "ocean_neuroticism_range" CHECK ("personas"."ocean_neuroticism" >= 0 AND "personas"."ocean_neuroticism" <= 100)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"persona_id" uuid NOT NULL,
	"scenario_context" jsonb NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;