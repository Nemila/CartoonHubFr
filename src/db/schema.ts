import { relations } from "drizzle-orm/relations";
import {
  pgTable,
  uniqueIndex,
  foreignKey,
  text,
  timestamp,
  serial,
  integer,
  doublePrecision,
  boolean,
  index,
  primaryKey,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const mediaType = pgEnum("MediaType", ["series", "movies"]);

const createdAt = timestamp({ precision: 3, mode: "string" })
  .default(sql`CURRENT_TIMESTAMP`)
  .notNull();
const updatedAt = timestamp({ precision: 3, mode: "string" })
  .default(sql`CURRENT_TIMESTAMP`)
  .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
  .notNull();

export const player = pgTable(
  "player",
  {
    url: text().notNull(),
    id: serial().primaryKey().notNull(),
    languageName: text().notNull(),
    hostName: text().notNull(),
    episodeId: integer().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("player_url_key").using(
      "btree",
      table.url.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.episodeId],
      foreignColumns: [episode.id],
      name: "player_episodeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.languageName],
      foreignColumns: [language.name],
      name: "player_languageName_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.hostName],
      foreignColumns: [host.name],
      name: "player_hostName_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);

export const media = pgTable(
  "media",
  {
    id: serial().primaryKey().notNull(),
    tmdbId: integer().notNull(),
    season: integer().notNull(),
    imdbId: text(),
    backdropImages: text().array(),
    posterImages: text().array(),
    videos: text().array(),
    title: text().notNull(),
    originalTitle: text().notNull(),
    alternativeTitles: text().array(),
    overview: text().notNull(),
    releaseDate: text().notNull(),
    posterPath: text(),
    backdropPath: text(),
    status: text(),
    popularity: doublePrecision().default(0).notNull(),
    rating: doublePrecision().default(0).notNull(),
    adult: boolean().default(false).notNull(),
    tagline: text(),
    mediaType: mediaType().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("media_mediaType_tmdbId_season_key").using(
      "btree",
      table.mediaType.asc().nullsLast().op("enum_ops"),
      table.tmdbId.asc().nullsLast().op("int4_ops"),
      table.season.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const host = pgTable(
  "host",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    priority: integer().default(10).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("host_slug_key").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const genre = pgTable(
  "genre",
  {
    id: serial().primaryKey().notNull(),
    tmdbId: integer().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("genre_name_key").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("genre_slug_key").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("genre_tmdbId_key").using(
      "btree",
      table.tmdbId.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const network = pgTable(
  "network",
  {
    id: serial().primaryKey().notNull(),
    slug: text().notNull(),
    tmdbId: integer().notNull(),
    logoPath: text().notNull(),
    name: text().notNull(),
    country: text().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("network_slug_key").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("network_tmdbId_key").using(
      "btree",
      table.tmdbId.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const provider = pgTable(
  "provider",
  {
    id: serial().primaryKey().notNull(),
    slug: text().notNull(),
    tmdbId: integer().notNull(),
    name: text().notNull(),
    logoPath: text().notNull(),
    priority: integer().default(20).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("provider_name_key").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("provider_slug_key").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("provider_tmdbId_key").using(
      "btree",
      table.tmdbId.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const episode = pgTable(
  "episode",
  {
    id: serial().primaryKey().notNull(),
    season: integer().notNull(),
    number: integer().notNull(),
    runtime: integer().default(0).notNull(),
    rating: doublePrecision().default(0).notNull(),
    mediaId: integer().notNull(),
    title: text(),
    releaseDate: text(),
    description: text(),
    stillPath: text(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("episode_mediaId_season_number_key").using(
      "btree",
      table.mediaId.asc().nullsLast().op("int4_ops"),
      table.season.asc().nullsLast().op("int4_ops"),
      table.number.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.mediaId],
      foreignColumns: [media.id],
      name: "episode_mediaId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);

export const language = pgTable("language", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  createdAt,
  updatedAt,
});

export const mediaToProvider = pgTable(
  "_mediaToProvider",
  {
    a: integer("A").notNull(),
    b: integer("B").notNull(),
  },
  (table) => [
    index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
    foreignKey({
      columns: [table.a],
      foreignColumns: [media.id],
      name: "_mediaToProvider_A_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.b],
      foreignColumns: [provider.id],
      name: "_mediaToProvider_B_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.a, table.b],
      name: "_mediaToProvider_AB_pkey",
    }),
  ],
);

export const mediaToNetwork = pgTable(
  "_mediaToNetwork",
  {
    a: integer("A").notNull(),
    b: integer("B").notNull(),
  },
  (table) => [
    index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
    foreignKey({
      columns: [table.a],
      foreignColumns: [media.id],
      name: "_mediaToNetwork_A_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.b],
      foreignColumns: [network.id],
      name: "_mediaToNetwork_B_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.a, table.b],
      name: "_mediaToNetwork_AB_pkey",
    }),
  ],
);

export const genreToMedia = pgTable(
  "_genreToMedia",
  {
    a: integer("A").notNull(),
    b: integer("B").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.a, table.b], name: "_genreToMedia_AB_pkey" }),
    index().using("btree", table.b.asc().nullsLast().op("int4_ops")),
    foreignKey({
      columns: [table.a],
      foreignColumns: [genre.id],
      name: "_genreToMedia_A_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.b],
      foreignColumns: [media.id],
      name: "_genreToMedia_B_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);

export const playerRelations = relations(player, ({ one }) => ({
  episode: one(episode, {
    fields: [player.episodeId],
    references: [episode.id],
  }),
  language: one(language, {
    fields: [player.languageName],
    references: [language.name],
  }),
  videoHost: one(host, {
    fields: [player.hostName],
    references: [host.name],
  }),
}));

export const episodeRelations = relations(episode, ({ one, many }) => ({
  players: many(player),
  media: one(media, {
    fields: [episode.mediaId],
    references: [media.id],
  }),
}));

export const languageRelations = relations(language, ({ many }) => ({
  players: many(player),
}));

export const videoHostRelations = relations(host, ({ many }) => ({
  players: many(player),
}));

export const mediaRelations = relations(media, ({ many }) => ({
  episodes: many(episode),
  providers: many(mediaToProvider),
  networks: many(mediaToNetwork),
  genres: many(genreToMedia),
}));

export const mediaToProviderRelations = relations(
  mediaToProvider,
  ({ one }) => ({
    media: one(media, {
      fields: [mediaToProvider.a],
      references: [media.id],
    }),
    provider: one(provider, {
      fields: [mediaToProvider.b],
      references: [provider.id],
    }),
  }),
);

export const providerRelations = relations(provider, ({ many }) => ({
  media: many(mediaToProvider),
}));

export const mediaToNetworkRelations = relations(mediaToNetwork, ({ one }) => ({
  media: one(media, {
    fields: [mediaToNetwork.a],
    references: [media.id],
  }),
  network: one(network, {
    fields: [mediaToNetwork.b],
    references: [network.id],
  }),
}));

export const networkRelations = relations(network, ({ many }) => ({
  media: many(mediaToNetwork),
}));

export const genreToMediaRelations = relations(genreToMedia, ({ one }) => ({
  genre: one(genre, {
    fields: [genreToMedia.a],
    references: [genre.id],
  }),
  media: one(media, {
    fields: [genreToMedia.b],
    references: [media.id],
  }),
}));

export const genreRelations = relations(genre, ({ many }) => ({
  media: many(genreToMedia),
}));
