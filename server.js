const http = require('http');
const Koa = require('koa');
const fs = require('fs');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('koa2-cors');
const comments = JSON.parse(fs.readFileSync('./data/comments.json'));
const posts = JSON.parse(fs.readFileSync('./data/posts.json'));

const app = new Koa();

// Body Parsers
app.use(koaBody({ json: true, text: true, urlencoded: true }));

// CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET'],
  })
);

const router = new Router();

router.get('/posts/latest', async (ctx) => {

  let postsList = []
  for (let item of posts) {
    const data = {
      id: item.id,
      authorId: item.userId,
      title: item.title,
      body: item.body,
      created: Date.now(),
    };
    postsList.push({...data});
  }
  ctx.response.body = postsList;
});

router.get('/comments/latest', async (ctx) => {

  let postsList = []
  for (let item of comments) {
    const data = {
      id: item.id,
      postId: item.postId,
      authorName: item.email,
      body: item.body,
      created: Date.now(),
    };
    postsList.push({...data});
  };
  ctx.response.body = postsList;
});

app.use(router.routes()).use(router.allowedMethods());


const port = process.env.PORT || 7104;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('Server started'));