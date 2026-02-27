import { v4 as uuidv4 } from 'uuid';
import { Command } from '@albertoficial/backend-shared';
import { type TracedHandlerContext } from '@albertoficial/observability-shared';
import { observability } from '../../setup/Observability';

export abstract class BaseTracedCommand<TCommand extends Command, TResult> implements Command {
  readonly commandId: string = uuidv4();
  readonly createdAt: Date = new Date();
  readonly correlationId?: string;

  protected abstract readonly commandName: string;
  protected abstract readonly metrics?: {
    counter?: { add: (value: number, attributes?: Record<string, string>) => void };
    histogram?: { record: (value: number, attributes?: Record<string, string>) => void };
    counterLabels?: Record<string, string>;
    histogramLabels?: Record<string, string>;
  };

  async executeWithTracing(
    handler: (command: TCommand, context: TracedHandlerContext) => Promise<TResult>
  ): Promise<TResult> {
    const tracer = observability.getTracer();
    const logger = observability.getLogger(this.commandName);

    const span = tracer.startSpan(`${this.commandName}.execute`, {
      attributes: {
        'command.name': this.commandName,
        'command.id': this.commandId,
        'correlation.id': this.correlationId || '',
        ...this.getSpanAttributes(),
      },
    });

    const startTime = Date.now();
    const context: TracedHandlerContext = {
      span,
      logger,
    };

    try {
      logger.info(
        {
          commandName: this.commandName,
          commandId: this.commandId,
          correlationId: this.correlationId,
          ...this.getSpanAttributes(),
        },
        `Processing ${this.commandName}`
      );

      const result = await handler(this as unknown as TCommand, context);
      const duration = Date.now() - startTime;

      this.onSuccess(result, duration, span);

      if (this.metrics?.counter) {
        this.metrics.counter.add(1, {
          status: 'success',
          ...(this.metrics.counterLabels ?? {}),
        });
      }

      if (this.metrics?.histogram) {
        this.metrics.histogram.record(duration, {
          status: 'success',
          ...(this.metrics.histogramLabels ?? {}),
        });
      }

      span.setStatus({ code: 1 });
      span.setAttribute('duration_ms', duration);

      logger.info(
        {
          commandName: this.commandName,
          commandId: this.commandId,
          duration,
          correlationId: this.correlationId,
          ...this.getSpanAttributes(),
        },
        `${this.commandName} completed successfully`
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as Error;

      span.recordException(err);
      span.setStatus({
        code: 2,
        message: err.message,
      });
      span.setAttribute('duration_ms', duration);

      if (this.metrics?.counter) {
        this.metrics.counter.add(1, {
          status: 'error',
          ...(this.metrics.counterLabels ?? {}),
        });
      }

      if (this.metrics?.histogram) {
        this.metrics.histogram.record(duration, {
          status: 'error',
          ...(this.metrics.histogramLabels ?? {}),
        });
      }

      observability.getBaseMetrics().errorsTotal.add(1, {
        command: this.commandName,
      });

      this.onError(err, duration, span);

      logger.error(
        {
          commandName: this.commandName,
          commandId: this.commandId,
          duration,
          error: err,
          correlationId: this.correlationId,
          ...this.getSpanAttributes(),
        },
        `${this.commandName} failed`
      );

      throw err;
    } finally {
      span.end();
    }
  }

  protected getSpanAttributes(): Record<string, string | number | boolean> {
    const attrs: Record<string, string | number | boolean> = {};

    if ('createdBy' in this && this.createdBy) attrs['command.created_by'] = this.createdBy as string;
    if ('updatedBy' in this && this.updatedBy) attrs['command.updated_by'] = this.updatedBy as string;
    if ('id' in this && this.id) attrs['id'] = this.id as string;

    return attrs;
  }

  protected onSuccess(
    _result: TResult,
    _duration: number,
    _span: TracedHandlerContext['span']
  ): void {}

  protected onError(
    _error: Error,
    _duration: number,
    _span: TracedHandlerContext['span']
  ): void {}
}
