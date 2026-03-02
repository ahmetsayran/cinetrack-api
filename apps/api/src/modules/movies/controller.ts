import { Elysia } from "elysia";
import { dtoWithMiddlewares, NotFoundException } from "../../utils";
import { PaginationService } from "../../utils/pagination";
import { AuditLogAction, AuditLogEntity, withAuditLog } from "../audit-logs";
import { auth, PERMISSIONS, withPermission } from "../auth";
import {
  movieCreateDto,
  movieDestroyDto,
  movieIndexDto,
  movieShowDto,
  movieUpdateDto,
} from "./dtos";
import { MovieFormatter } from "./formatters";
import { MoviesService } from "./service";

const app = new Elysia({ prefix: "/movies", tags: ["Movie"] })
  .get(
    "/",
    async ({ query }) => {
      const { data, total } = await MoviesService.index(query);
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: MovieFormatter.response,
      });
    },
    movieIndexDto,
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const movie = await MoviesService.show(params.uuid);
      if (!movie) throw new NotFoundException("Film bulunamadı");
      return MovieFormatter.response(movie);
    },
    movieShowDto,
  )
  .use(auth())
  .post(
    "/",
    async ({ body }) => {
      const movie = await MoviesService.store(body);
      return MovieFormatter.response(movie);
    },
    dtoWithMiddlewares(
      movieCreateDto,
      withPermission(PERMISSIONS.MOVIES.CREATE),
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.MOVIE,
        getEntityUuid: (ctx) => {
          // @ts-ignore // TODO: fix this
          const response = ctx.response as ReturnType<
            typeof MovieFormatter.response
          >;
          return response.uuid;
        },
        getDescription: () => "Yeni film oluşturuldu",
      }),
    )
  )
  .put(
    "/:uuid",
    async ({ params, body }) => {
      const movie = await MoviesService.update(params.uuid, body);
      if (!movie) throw new NotFoundException("Film bulunamadı");
      return MovieFormatter.response(movie);
    },
    dtoWithMiddlewares(
      movieUpdateDto,
      withPermission(PERMISSIONS.MOVIES.UPDATE),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.MOVIE,
        getEntityUuid: ({ params }) => params.uuid!,
        getDescription: ({ body }) =>
          `Film güncellendi: ${Object.keys(body as object).join(", ")}`,
        getMetadata: ({ body }) => ({ updatedFields: body }),
      }),
    )
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      const movie = await MoviesService.destroy(params.uuid);
      if (!movie) throw new NotFoundException("Film bulunamadı");
      return { message: "Film başarıyla silindi" };
    },
    dtoWithMiddlewares(
      movieDestroyDto,
      withPermission(PERMISSIONS.MOVIES.DESTROY),
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.MOVIE,
        getEntityUuid: ({ params }) => params.uuid!,
        getDescription: () => "Film silindi",
      }),
    )
  );

export default app;
