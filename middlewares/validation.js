
const validation = (schema, property) => { 
    return (req, res, next) => {
    const { error } = schema.validate(req.body);
    let validationResult  = schema.validate(req.body); 
    const valid = error == null;
    
    if (valid) { 
      req.body = property ? validationResult.value[property] : validationResult.value;
      next(); 
    } else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',');
  
      return res.status(422).json({ error: message }) } 
    } 
  }
  
  module.exports = validation;