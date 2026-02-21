import express from 'express';
import eventsRouter from './routes/events';
import userRouter from './routes/user';
import configRouter from './routes/config';
import { requestLogger } from './logger';

const createApp = () => {
  const app = express();
  // log every incoming request
  app.use(requestLogger);
  app.use(express.json());

  // simple (and slightly ridiculous) root check
  app.get('/', (_req, res) =>
    res.send(`
      <html><body style="font-family:sans-serif; text-align:center; padding:50px;">
        <h1>🎉 Congrats!</h1>
        <p>You have discovered the <strong>secret backend portal</strong>.</p>
        <img src="https://media.giphy.com/media/26FPJGjhefSJuaRhu/giphy.gif" alt="celebration" />
        <p>If you were expecting a treasure, you might still be waiting… but at least you found this!</p>
      </body></html>
    `),
  );

  app.get('/health', (_req, res) => {
    const uptimeSeconds = process.uptime();
    res.json({
      ok: true,
      service: 'admin-api',
      uptime: `${Math.floor(uptimeSeconds)}s`, // integer seconds
      memory: process.memoryUsage(),
      node: process.version,
      platform: process.platform,
      timestamp: Date.now(),
    });
  });

  // mount routes
  app.use('/api/admin/events', eventsRouter);
  app.use('/api/user', userRouter);
  app.use('/api/admin/config', configRouter);

  return app;
};

export default createApp;
