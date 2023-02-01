const Logs = require('../classes/Log');

module.exports = {
  logs: async (req, res, next) => {
    const log = new Logs({
      url: process.env.BASE_URL + req.originalUrl,
      method: req.method,
      data: req.body,
      params: req.query,
      headers: req.headers,
    });
    await log.save().catch(err => {
      return res.status(500).send(err);
    })
    res.on('finish', async () => {
      await log.update({_id: log._id}, {status: res.statusCode, response: res.locals.response}).catch(e => {
        return res.status(500).send(e);
      })
    })
    next();
  },
  graphqlLogs: async (req, res, next) => {
    const log = new Logs({
      url: process.env.BASE_URL + '/gql',
      method: 'POST',
      type: 'graphql',
      data: {
        query: req.body.query,
        variables: req.body.variables,
      },
      headers: req.headers,
    });
    await log.save().catch(err => {
      return res.status(500).send(err);
    })
    res.on('finish', async () => {
      await log.update({_id: log._id}, {status: res.statusCode, response: res.locals.response}).catch(e => {
        return res.status(500).send(e);
      })
    })
    next();
  }
}