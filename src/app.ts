import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import { swaggerSpec } from './docs/swagger';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'REST API for Users, Posts, and Comments' });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/post', postsRouter);
app.use('/comment', commentsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
