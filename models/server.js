const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      user: "/api/users",
      headerBill: "/api/headerBill",
      billDetail: "/api/billDetail",
      auth: "/api/auth",
      category: "/api/categories",
      product: "/api/products",
      find: "/api/find",
      uploads: "/api/uploads",
    };

    //Connect to Database
    this.ConnectDB();
    //Middleware
    this.middleware();
    //Rutas de mi aplicacion
    this.routes();
  }

  async ConnectDB() {
    await dbConnection();
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.user, require("../routes/user.routes"));
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.category, require("../routes/category.routes"));
    this.app.use(this.paths.product, require("../routes/product.routes"));
    this.app.use(this.paths.headerBill, require("../routes/headerBill.routes"));
    this.app.use(this.paths.billDetail, require("../routes/billDetail.routes"));
    this.app.use(this.paths.find, require("../routes/find.routes"));
    this.app.use(this.paths.uploads, require("../routes/upload.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`POO Server is working in port: ${this.port}`);
    });
  }
}

module.exports = Server;
