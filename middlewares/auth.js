const Logs = require('../classes/Log');

module.exports = {
  auth: async (req, res, next) => {
    const logData = {
      url: process.env.BASE_URL + req.originalUrl,
      method: req.method,
      status: null,
      data: req.body,
      params: req.query,
      headers: req.headers,
      response: {},
    }
    if(!req.headers['authorization']) {
      const Log = new Logs({
        ...logData,
        status: 401,
        response: {error: 'No token was given!'}
      });
      await Log.save().catch(err => {
        return res.status(500).send({status: 500, err});
      })
      return res.status(401).send({status: 401, message: 'No token was given!' });
    }
    if(!req.headers['user']) {
      const Log = new Logs({
        ...logData,
        status: 401,
        response: {error: 'No user id was recived! User not found or token was invalid.'}
      });
      await Log.save().catch(err => {
        return res.status(500).send({status: 500, err});
      })
      return res.status(401).send({ status: 401, message: 'No user id was recived! User not found or token was invalid.' })
    }
    try {
      const user = JSON.parse(req.headers['user'])
      if (!!user.roles) {
        res.locals.roles = user.roles
        if (!res.locals.roles.find(v => ['admin', 'merchant', 'terminal', 'manager', 'customer', 'employee', 'superadmin'].includes(v.role))) {
          const Log = new Logs({
            ...logData,
            status: 401,
            response: {error: 'Unauthorized role.'}
          });
          await Log.save().catch(err => {
            return res.status(500).send(err);
          })
          return res.status(401).send({ status: 401, message: 'Unauthorized role.' })
        }
      }
      res.locals.user = user.id
      next()
    } catch (e) {
      const Log = new Logs({
        ...logData,
        status: 400,
        response: {error: e}
      });
      await Log.save().catch(err => {
        return res.status(500).send({status: 500, err});
      })
      return res.status(400).send({status: 400, e});
    }
  },
}
