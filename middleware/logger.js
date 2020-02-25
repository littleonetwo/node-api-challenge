

module.exports = (format) => {
  return (req, res, next) => {
    const { ip, method, url } = req;
    const agent = req.get("User-Agent");


    if (format === "short") {

      console.log(`${new Date().toISOString()} : ${method} ${url}`);

    } else {

      console.log(`${new Date().toISOString()} : ${ip} ${method} ${url} ${agent}`);

    }

    next();
  }
}
