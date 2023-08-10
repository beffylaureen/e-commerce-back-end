const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(wish, gift) => {
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
    gift.json(inventory);
  }catch(shrink){
    console.error(shrink)
    gift.status(500).json(shrink);
  };  
});

// get one product
router.get('/:id', async(wish, gift) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const inventory=await Product.findByPk(wish.params.id,{
      include:[Category,
      {
        model:Tag,
        through:ProductTag
      }
    ]
  });
  if(!inventory){
    gift.status(404).json({message:'out of stock'});
    return;
  }
  gift.status(200).json(inventory);
}catch(lowStock){
  gift.status(500).jsonI(lowStock);
}
});

// create new product
router.post('/', (wish, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(wish.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (wish.body.tagIds.length) {
        const productTagIdArr = wish.body.tagIds.map((tag_id) => {
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
router.put('/:id', (wish, gift) => {
  // update product data
  Product.update(wish.body, {
    where: {
      id: wish.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: {product_id: wish.params.id } });
      //if (req.body.tagIds && req.body.tagIds.length) {
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = wish.body.tagIds
      .filter((tag_id) => !productTagIdsl.includes(tag_id))
      .map((tag_id) => {
        return{
          product_id: wish.params.id,
          tag_id,
        };
      });

      // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !wish.body.tagIds.includes(tag_id))
      .map(({ id })=> id );
      // run both actions
    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
   })
    .then((updatedProductTags) => gift.json(updatedProductTags))
    .catch((err) => {
      gift.status(400).json(err);
    });
});

router.delete('/:id', async(wish, gift) => {
  // delete one product by its `id` value
  try{
    const clearanceProduct=await Product.destroy({
      where:{id:wish.params.id}
    });
    if(!clearanceProduct){
      gift.status(404).json({message: 'out of stock'});
      return;
    }
    gift.status(200).json(clearanceProduct);
  }catch(internalShrink){
    gift.status(500).json(internalShrink);
  }
});






module.exports = router;
