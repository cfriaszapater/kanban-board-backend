var moment = require('moment');

function dateFormat (date) {
  if (date == null) {
    return '';
  }
  return moment(date).format('DD/MM/YYYY');
}
module.exports = dateFormat;
