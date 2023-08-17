const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try{
    const inventory=await Product.findAll({
      include:[
        Category,
        {
          model:Tag,
          through:Product
        }
      ]
    });
    res.json(inventory);
  }catch(err){
    console.error(err)
    res.status(500).json(err);
  };  
});

// get one product
router.get('/:id', async(req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const inventory=await Product.findByPk(req.params.id,{
      include:[Category,
      {
        model:Tag,
        through:ProductTag
      }
    ]
  });
  if(!inventory){
    res.status(404).json({message:'out of stock'});
    return;
  }
  res.status(200).json(inventory);
}catch(lowStock){
  res.status(500).json(lowStock);
}
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(productTagIds);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: {product_id: req.params.id } });
      //if (req.body.tagIds && req.body.tagIds.length) {
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return{
          product_id: req.params.id,
          tag_id,
        };
      });

      // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id })=> id );
      // run both actions
    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
   })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async(req, res) => {
  // delete one product by its `id` value
  try{
    const clearanceProduct=await Product.destroy({
      where:{id:req.params.id}
    });
    if(!clearanceProduct){
      res.status(404).json({message: 'out of stock'});
      return;
    }
    res.status(200).json(clearanceProduct);
  }catch(internalError){
    res.status(500).json(internalError);
  }
});






module.exports = router;
