function HttpException({
  status,
  message = null,
  data = null,
  headers = null,
}) {
  this.status = status;
  this.data = data;
  this.headers = headers;
  this.message = message;

  this.toString = function toString() {
    return `
    Status Code: ${this.status}
    Message: ${this.message}
    Data: ${JSON.stringify(this.data)}`;
  };
}

module.exports = {
  HttpException,
};
