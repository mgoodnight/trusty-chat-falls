import { Request as ExpressRequest, Response } from 'express';
import healthcheckController from '../../src/routes/controllers/healthcheck';

describe('Healcheck tests', () => {
  it('Healthy response', async () => {
    const req = {} as ExpressRequest;
    const res = { send: jest.fn() } as unknown as Response;

    await healthcheckController(req, res);

    expect(res.send).toHaveBeenCalled();
  });
});
