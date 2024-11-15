const knex = require("../database/knex");
const Paginator = require("./paginator");

function productImageRepository() {
  return knex("productImages");
}

function productRepository() {
  return knex("products");
}

function readProduct(payload) {
  return {
    ProductName: payload.ProductName,
    CategoryID: payload.CategoryID,
    Description: payload.Description,
    Price: payload.Price,
    StockQuantity: payload.StockQuantity,
    CreatedBy: payload.CreatedBy,
    UpdatedAt: new Date(),
    UpdatedBy: payload.UpdatedBy,
    IsDeleted: payload.IsDeleted,
  };
}

async function createProduct(payload) {
  const { ProductName, files, CreatedBy } = payload;

  const existingProduct = await productRepository()
    .where("ProductName", ProductName)
    .select("*")
    .first();

  if (existingProduct) {
    if (existingProduct.IsDeleted) {
      const product = readProduct(payload);
      await productRepository()
        .where("ProductID", existingProduct.ProductID)
        .update({ ...product, IsDeleted: false });

      await productImageRepository()
        .where("ProductID", existingProduct.ProductID)
        .delete();

      if (Array.isArray(files) && files.length !== 0) {
        const fileNames = files.map((file) => file.filename);
        await insertImages(existingProduct.ProductID, fileNames);
      }
      return { id: existingProduct.ProductID, ...product };
    }
    return { message: "Product already exist." };
  }

  const product = readProduct(payload);
  const [id] = await productRepository().insert(product);
  if (Array.isArray(files) && files.length !== 0) {
    const fileNames = files.map((file) => file.filename);
    await insertImages(id, fileNames);
  }
  return { id, ...product };
}

// Hàm chèn image cho sản phẩm
async function insertImages(ProductID, fileNames) {
  const userRoles = fileNames.map((fileName) => ({
    ProductID,
    ImageUrl: `/public/uploads/products/${fileName}`,
  }));

  await productImageRepository().insert(userRoles);
}

async function getManyProducts(query) {
  const { search, CategoryID, page = 1, limit = 5, sort } = query;
  const paginator = new Paginator(page, limit);

  const queryBuilder = productRepository()
    .from("products as p")
    .where("p.IsDeleted", false)
    .where((builder) => {
      if (search) {
        builder.where("p.ProductName", "like", `%${search}%`);
      }
      if (CategoryID) {
        builder.where("p.CategoryID", "=", CategoryID);
      }
    })
    .select(
      knex.raw("count(p.ProductID) OVER() AS recordCount"),
      "p.ProductID",
      "c.CategoryName",
      "p.ProductName",
      "p.Description",
      "p.Price",
      "p.StockQuantity",
      "u.FullName as CreatedName",
      "p.CreatedAt",
      "p.UpdatedAt",
      "pi.ImageUrl"
    )
    .leftJoin("categories as c", "p.CategoryID", "c.CategoryID")
    .leftJoin("users as u", "p.CreatedBy", "u.UserID")
    .leftJoin(
      knex
        .select("pi.ProductID", "pi.ImageUrl")
        .from("productimages as pi")
        .select(
          knex.raw(
            "ROW_NUMBER() OVER (PARTITION BY pi.ProductID ORDER BY pi.ImageID ASC) as row_num"
          )
        )
        .as("pi"),
      function () {
        this.on("p.ProductID", "=", "pi.ProductID").andOn(
          knex.raw("pi.row_num = 1")
        );
      }
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  if (sort) {
    const [sortField, sortOrder] = sort.split(".");
    queryBuilder.orderBy(`p.${sortField}`, sortOrder);
  }

  let results = await queryBuilder;
  
  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });

  return {
    products: results,
    metadata: paginator.getMetadata(totalRecords),
  };
}

async function getProductById(id) {
  return await productRepository()
    .from("products as p")
    .where("p.ProductID", id)
    .andWhere("p.IsDeleted", false)
    .select(
      "p.ProductID",
      "p.CategoryID",
      "c.CategoryName",
      "p.ProductName",
      "p.Description",
      "p.Price",
      "p.StockQuantity",
      "u.FullName as CreatedName",
      "p.CreatedAt",
      "p.UpdatedAt"
    )
    .leftJoin("categories as c", "p.CategoryID", "c.CategoryID")
    .leftJoin("users as u", "p.CreatedBy", "u.UserID")
    .first();
}

async function updateProduct(id, payload) {
  const { files, UpdatedBy } = payload;
  const updatedProduct = await productRepository()
    .where("ProductID", id)
    .andWhere("IsDeleted", false)
    .select("*")
    .first();

  if (!updatedProduct) {
    return null;
  }

  const update = readProduct(payload);
  await productRepository().where("ProductID", id).update(update);

  if (Array.isArray(files) && files.length !== 0) {
    const fileNames = files.map((file) => file.filename);
    await insertImages(id, fileNames);
  }
  return { ...updatedProduct, ...update };
}

async function deleteProduct(id, UserID) {
  const deletedProduct = await productRepository()
    .where("ProductID", id)
    .first();

  if (!deletedProduct) {
    return null;
  }

  await productRepository()
    .where("ProductID", id)
    .update({ IsDeleted: true, UpdatedAt: UserID });

  return deletedProduct;
}

async function deleteProductsByIds(productIds, UserID) {
  await productRepository()
    .whereIn("ProductID", productIds)
    .update({ IsDeleted: true, UpdatedAt: UserID });
}

async function CheckProductAvailability(dataOrderDetail) {
  const unavailableProducts = [];

  for (const item of dataOrderDetail) {
    const product = await productRepository()
      .select("ProductID", "ProductName", "StockQuantity")
      .where("ProductID", item.ProductID)
      .andWhere("IsDeleted", false)
      .first();

    if (!product) {
      throw new Error(`Product with ID ${item.ProductID} not found`);
    }

    if (item.Quantity > product.StockQuantity) {
      unavailableProducts.push({
        ProductName: product.ProductName,
        Quantity: product.StockQuantity,
      });
    }
  }

  return unavailableProducts;
}

module.exports = {
  getManyProducts,
  deleteProductsByIds,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  CheckProductAvailability
};
