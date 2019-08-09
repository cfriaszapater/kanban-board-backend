var moment = require('moment');

function dateFormat (date) {
  return moment(date).format('DD/MM/YYYY');
}
module.exports = dateFormat;
