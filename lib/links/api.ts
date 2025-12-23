import { authenticatedRequest, BaseResponse } from '../utils';
import { CreateLinkRequest, LinkResponse } from './types';

export async function createLink(
  body: CreateLinkRequest
): Promise<LinkResponse> {
  const response = await authenticatedRequest<BaseResponse<LinkResponse>>(
    '/links/create',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  return response.data;
}
