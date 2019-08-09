var moment = require('moment');

function dateFormat (date) {
  return moment(date).format('MMMM Do, YYYY');
}
module.exports = dateFormat;
