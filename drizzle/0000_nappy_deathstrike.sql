-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."MediaType" AS ENUM('series', 'movies');--> statement-breakpoint
CREATE TABLE "Network" (
	"slug" text NOT NULL,
	"tmdbId" integer NOT NULL,
	"logoPath" text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Genre" (
	"tmdbId" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Language" (
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Media" (
	"tmdbId" integer NOT NULL,
	"season" integer NOT NULL,
	"imdbId" text,
	"backdropImages" text[],
	"posterImages" text[],
	"videos" text[],
	"title" text NOT NULL,
	"originalTitle" text NOT NULL,
	"alternativeTitles" text[],
	"overview" text NOT NULL,
	"releaseDate" text NOT NULL,
	"posterPath" text,
	"backdropPath" text,
	"status" text,
	"popularity" double precision DEFAULT 0 NOT NULL,
	"rating" double precision DEFAULT 0 NOT NULL,
	"adult" boolean DEFAULT false NOT NULL,
	"tagline" text,
	"mediaType" "MediaType" NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Player" (
	"url" text NOT NULL,
	"languageName" text NOT NULL,
	"videoHostName" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"episodeId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "VideoHost" (
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"priority" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WatchProvider" (
	"slug" text NOT NULL,
	"tmdbId" integer NOT NULL,
	"name" text NOT NULL,
	"logoPath" text NOT NULL,
	"priority" integer DEFAULT 20 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Episode" (
	"season" integer NOT NULL,
	"number" integer NOT NULL,
	"runtime" integer DEFAULT 0 NOT NULL,
	"rating" double precision DEFAULT 0 NOT NULL,
	"title" text,
	"releaseDate" text,
	"description" text,
	"stillPath" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"mediaId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_MediaToNetwork" (
	"A" integer NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_MediaToNetwork_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_MediaToWatchProvider" (
	"A" integer NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_MediaToWatchProvider_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_GenreToMedia" (
	"A" integer NOT NULL,
	"B" integer NOT NULL,
	CONSTRAINT "_GenreToMedia_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
ALTER TABLE "Player" ADD CONSTRAINT "Player_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "public"."Language"("name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Player" ADD CONSTRAINT "Player_videoHostName_fkey" FOREIGN KEY ("videoHostName") REFERENCES "public"."VideoHost"("name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Player" ADD CONSTRAINT "Player_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "public"."Episode"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToNetwork" ADD CONSTRAINT "_MediaToNetwork_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToNetwork" ADD CONSTRAINT "_MediaToNetwork_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Network"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToWatchProvider" ADD CONSTRAINT "_MediaToWatchProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToWatchProvider" ADD CONSTRAINT "_MediaToWatchProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WatchProvider"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Genre"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Media"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Network_slug_key" ON "Network" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Network_tmdbId_key" ON "Network" USING btree ("tmdbId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Genre_tmdbId_key" ON "Genre" USING btree ("tmdbId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Media_mediaType_tmdbId_season_key" ON "Media" USING btree ("mediaType" int4_ops,"tmdbId" int4_ops,"season" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Player_url_key" ON "Player" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WatchProvider_slug_key" ON "WatchProvider" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WatchProvider_tmdbId_key" ON "WatchProvider" USING btree ("tmdbId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Episode_mediaId_season_number_key" ON "Episode" USING btree ("mediaId" int4_ops,"season" int4_ops,"number" int4_ops);--> statement-breakpoint
CREATE INDEX "_MediaToNetwork_B_index" ON "_MediaToNetwork" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE INDEX "_MediaToWatchProvider_B_index" ON "_MediaToWatchProvider" USING btree ("B" int4_ops);--> statement-breakpoint
CREATE INDEX "_GenreToMedia_B_index" ON "_GenreToMedia" USING btree ("B" int4_ops);
*/