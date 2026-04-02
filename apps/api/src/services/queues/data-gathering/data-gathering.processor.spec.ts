import { DataGatheringProcessor } from './data-gathering.processor';

describe('DataGatheringProcessor', () => {
  let processor: DataGatheringProcessor;
  let mockDeadLetterQueue: { add: jest.Mock };
  let mockJob: {
    id: string;
    name: string;
    data: Record<string, unknown>;
    attemptsMade: number;
    opts: { attempts: number };
    remove: jest.Mock;
  };

  beforeEach(() => {
    mockDeadLetterQueue = {
      add: jest.fn().mockResolvedValue(undefined)
    };

    processor = new DataGatheringProcessor(
      mockDeadLetterQueue as any,
      null,
      null,
      null,
      null
    );

    mockJob = {
      id: 'test-job-1',
      name: 'GATHER_ASSET_PROFILE',
      data: { dataSource: 'YAHOO', symbol: 'AAPL' },
      attemptsMade: 12,
      opts: { attempts: 12 },
      remove: jest.fn().mockResolvedValue(undefined)
    };
  });

  describe('onFailed', () => {
    it('should move job to dead-letter queue when all attempts are exhausted', async () => {
      const error = new Error('Provider timeout');

      await processor.onFailed(mockJob as any, error);

      expect(mockDeadLetterQueue.add).toHaveBeenCalledWith(
        'GATHER_ASSET_PROFILE',
        expect.objectContaining({
          dataSource: 'YAHOO',
          symbol: 'AAPL',
          failedReason: 'Provider timeout',
          originalJobId: 'test-job-1'
        })
      );
      expect(mockJob.remove).toHaveBeenCalled();
    });

    it('should not move job to dead-letter queue when attempts remain', async () => {
      mockJob.attemptsMade = 5;
      const error = new Error('Temporary failure');

      await processor.onFailed(mockJob as any, error);

      expect(mockDeadLetterQueue.add).not.toHaveBeenCalled();
      expect(mockJob.remove).not.toHaveBeenCalled();
    });

    it('should include failedAt timestamp in dead-letter job data', async () => {
      const error = new Error('Network error');
      const before = new Date().toISOString();

      await processor.onFailed(mockJob as any, error);

      const addCall = mockDeadLetterQueue.add.mock.calls[0];
      const jobData = addCall[1];
      expect(jobData.failedAt).toBeDefined();
      expect(new Date(jobData.failedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(before).getTime()
      );
    });

    it('should handle null error gracefully', async () => {
      await processor.onFailed(mockJob as any, null);

      expect(mockDeadLetterQueue.add).toHaveBeenCalledWith(
        'GATHER_ASSET_PROFILE',
        expect.objectContaining({
          failedReason: undefined,
          originalJobId: 'test-job-1'
        })
      );
      expect(mockJob.remove).toHaveBeenCalled();
    });

    it('should default to 1 attempt when opts.attempts is undefined', async () => {
      mockJob.opts = {} as any;
      mockJob.attemptsMade = 1;
      const error = new Error('Failure');

      await processor.onFailed(mockJob as any, error);

      expect(mockDeadLetterQueue.add).toHaveBeenCalled();
      expect(mockJob.remove).toHaveBeenCalled();
    });
  });
});
