import {
  getLinksApi,
  ResponsesLinkResponse,
  LinksAllGetOrderByEnum,
} from '../api-client/client';
import { withTokenRefresh, AuthApiError } from '../auth/api';
import type { CreateLinkRequest, Link } from './types';
import { handleApiError } from '../utils/api-error';

function mapLinkResponse(link: ResponsesLinkResponse): Link {
  return {
    id: link.id ?? '',
    original_url: link.originalUrl ?? '',
    short_code: link.shortCode ?? '',
    custom_short_code: link.customShortCode,
    expired_at: link.expiredAt,
    click_count: link.clickCount,
    created_at: link.createdAt ?? '',
  };
}

/**
 * Create a new shortened link
 */
export async function createLink(body: CreateLinkRequest): Promise<Link> {
  return withTokenRefresh(async () => {
    try {
      const linksApi = getLinksApi();
      const response = await linksApi.linksCreatePost({
        request: {
          originalUrl: body.original_url ?? '',
          customShortCode: body.custom_short_code,
          expiredAt: body.expired_at,
        },
      });

      const link = response.data;
      if (!link) {
        throw new AuthApiError('Invalid response from server');
      }

      return mapLinkResponse(link);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * Get all links for the authenticated user
 */
export async function getLinks(options?: {
  page?: number;
  limit?: number;
  orderBy?: 'created_at' | 'counts';
}): Promise<Link[]> {
  return withTokenRefresh(async () => {
    try {
      const linksApi = getLinksApi();
      const response = await linksApi.linksAllGet({
        page: options?.page,
        limit: options?.limit,
        orderBy:
          options?.orderBy === 'counts'
            ? LinksAllGetOrderByEnum.Counts
            : options?.orderBy === 'created_at'
              ? LinksAllGetOrderByEnum.CreatedAt
              : undefined,
      });

      const links = response.data;
      if (!links) {
        return [];
      }

      return links.map(mapLinkResponse);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * Get a specific link by ID
 */
export async function getLinkById(id: string): Promise<Link> {
  return withTokenRefresh(async () => {
    try {
      const linksApi = getLinksApi();
      const response = await linksApi.linksIdGet({ id });

      const link = response.data;
      if (!link) {
        throw new AuthApiError('Link not found', 404);
      }

      return mapLinkResponse(link);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
