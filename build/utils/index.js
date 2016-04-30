'use strict';

module.exports = {
  validationError: function(res, err){
    return res.status(422).json(err);
  }
}
