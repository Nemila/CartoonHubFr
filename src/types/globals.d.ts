export {};

export type Roles = "admin" | "moderator";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }

  type GetPaginatedMediaType = {
    mediaType?: MediaType;
    page: number;
  };

  type FindMediaTypes = {
    orderBy?: Prisma.MediaOrderByWithRelationInput;
    mediaType?: MediaType;
    published?: boolean;
    take?: number;
  };

  type GetRelatedMediaType = {
    mediaType: "tvShows" | "movies";
    tmdbId: number;
  };

  type GetMediaDetailsType = {
    tmdbId: number;
    season: number;
    episode: number;
    mediaType: "series" | "movies";
  };

  type AbyssFile = {
    name: string;
    size: number;
    slug: string;
    resolution: number;
    status: string;
  };

  type AbyssListResponse = {
    items: AbyssFile[];
    pagination: {
      current: number;
      next: number;
    };
  };
}
