import { Elysia } from "elysia";
import { dtoWithMiddlewares, NotFoundException } from "../../utils";
import { PaginationService } from "../../utils/pagination";
import { AuditLogAction, AuditLogEntity, withAuditLog } from "../audit-logs";
import { auth, PERMISSIONS, withPermission } from "../auth";
import {
  watchlistCreateDto,
  watchlistDestroyDto,
  watchlistIndexDto,
  watchlistShowDto,
  watchlistUpdateDto,
} from "./dtos";
import { WatchlistFormatter } from "./formatters";
import { WatchlistService } from "./service";

const app = new Elysia({ prefix: "/watchlist", tags: ["Watchlist"] })
  .use(auth())
  .get(
    "/:userId",
    async ({ params: { userId }, query }) => {
      const { data, total } = await WatchlistService.index(userId, query);
      return PaginationService.createPaginatedResponse({
        data,
        total,
        query,
        formatter: WatchlistFormatter.response,
      });
    },
    dtoWithMiddlewares(
      watchlistIndexDto,
      withPermission(PERMISSIONS.WATCHLISTS.SHOW)
    )
  )
  .get(
    "/item/:uuid",
    async ({ params }) => {
      const item = await WatchlistService.show(params.uuid);
      if (!item) throw new NotFoundException("İzleme listesi öğesi bulunamadı");
      return WatchlistFormatter.response(item);
    },
    dtoWithMiddlewares(
      watchlistShowDto,
      withPermission(PERMISSIONS.WATCHLISTS.SHOW)
    )
  )
  .post(
    "/",
    async ({ body, user }) => {
      const item = await WatchlistService.store({ ...body, userId: user.id } as any);
      return WatchlistFormatter.response(item);
    },
    dtoWithMiddlewares(
      watchlistCreateDto,
      withPermission(PERMISSIONS.WATCHLISTS.CREATE),
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.WATCHLIST,
        getEntityUuid: (ctx) => {
          // @ts-ignore // TODO: fix this
          const response = ctx.response as ReturnType<
            typeof WatchlistFormatter.response
          >;
          return response.uuid;
        },
        getDescription: () => "İzleme listesine yeni film eklendi",
      })
    )
  )
  .put(
    "/:uuid",
    async ({ params, body }) => {
      const item = await WatchlistService.update(params.uuid, body);
      if (!item) throw new NotFoundException("İzleme listesi öğesi bulunamadı");
      return WatchlistFormatter.response(item);
    },
    dtoWithMiddlewares(
      watchlistUpdateDto,
      withPermission(PERMISSIONS.WATCHLISTS.UPDATE),
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.WATCHLIST,
        getEntityUuid: ({ params }) => params.uuid!,
        getDescription: ({ body }) =>
          `İzleme listesi öğesi güncellendi: ${Object.keys(body as object).join(", ")}`,
        getMetadata: ({ body }) => ({ updatedFields: body }),
      })
    )
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      const item = await WatchlistService.destroy(params.uuid);
      if (!item) throw new NotFoundException("İzleme listesi öğesi bulunamadı");
      return { message: "İzleme listesi öğesi başarıyla silindi" };
    },
    dtoWithMiddlewares(
      watchlistDestroyDto,
      withPermission(PERMISSIONS.WATCHLISTS.DESTROY),
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.WATCHLIST,
        getEntityUuid: ({ params }) => params.uuid!,
        getDescription: () => "İzleme listesi öğesi silindi",
      })
    )
  );

export default app;
