import { Elysia } from "elysia";
import { dtoWithMiddlewares, NotFoundException } from "../../utils";
import { PaginationService } from "../../utils/pagination";
import { AuditLogAction, AuditLogEntity, withAuditLog } from "../audit-logs";
import { auth, PERMISSIONS, withPermission } from "../auth";
import {
    reviewCreateDto,
    reviewDestroyDto,
    reviewIndexDto,
    reviewShowDto,
    reviewUpdateDto,
} from "./dtos";
import { ReviewFormatter } from "./formatters";
import { ReviewService } from "./service";

const app = new Elysia({ prefix: "/reviews", tags: ["Reviews"] })
    .use(auth())
    .get(
        "/",
        async ({ query }) => {
            const { data, total } = await ReviewService.index(query);
            return PaginationService.createPaginatedResponse({
                data,
                total,
                query,
                formatter: ReviewFormatter.response,
            });
        },
        dtoWithMiddlewares(
            reviewIndexDto,
            withPermission(PERMISSIONS.REVIEWS.SHOW)
        )
    )
    .get(
        "/:uuid",
        async ({ params }) => {
            const item = await ReviewService.show(params.uuid);
            if (!item) throw new NotFoundException("İnceleme bulunamadı");
            return ReviewFormatter.response(item);
        },
        dtoWithMiddlewares(
            reviewShowDto,
            withPermission(PERMISSIONS.REVIEWS.SHOW)
        )
    )
    .post(
        "/",
        async ({ body, user }) => {
            const item = await ReviewService.store({ ...body, userId: user.id } as any);
            return ReviewFormatter.response(item);
        },
        dtoWithMiddlewares(
            reviewCreateDto,
            withPermission(PERMISSIONS.REVIEWS.CREATE),
            withAuditLog({
                actionType: AuditLogAction.CREATE,
                entityType: AuditLogEntity.REVIEW,
                getEntityUuid: (ctx) => {
                    // @ts-ignore
                    const response = ctx.response as ReturnType<
                        typeof ReviewFormatter.response
                    >;
                    return (response as any).uuid;
                },
                getDescription: () => "Filme yeni bir inceleme eklendi",
            })
        )
    )
    .put(
        "/:uuid",
        async ({ params, body }) => {
            const item = await ReviewService.update(params.uuid, body);
            if (!item) throw new NotFoundException("İnceleme bulunamadı");
            return ReviewFormatter.response(item);
        },
        dtoWithMiddlewares(
            reviewUpdateDto,
            withPermission(PERMISSIONS.REVIEWS.UPDATE),
            withAuditLog({
                actionType: AuditLogAction.UPDATE,
                entityType: AuditLogEntity.REVIEW,
                getEntityUuid: ({ params }) => params.uuid!,
                getDescription: ({ body }) =>
                    `İnceleme güncellendi`,
                getMetadata: ({ body }) => ({ updatedFields: body }),
            })
        )
    )
    .delete(
        "/:uuid",
        async ({ params }) => {
            const item = await ReviewService.destroy(params.uuid);
            if (!item) throw new NotFoundException("İnceleme bulunamadı");
            return { message: "İnceleme başarıyla silindi" };
        },
        dtoWithMiddlewares(
            reviewDestroyDto,
            withPermission(PERMISSIONS.REVIEWS.DESTROY),
            withAuditLog({
                actionType: AuditLogAction.DELETE,
                entityType: AuditLogEntity.REVIEW,
                getEntityUuid: ({ params }) => params.uuid!,
                getDescription: () => "İnceleme silindi",
            })
        )
    );

export default app;
