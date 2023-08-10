const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(order, package) => {
  // find all categories
  // be sure to include its associated Products
try{
  const catalog=await Category.findAll(order.params.id,{
    include:[{model:Product},{model:Tag}]
  });
  if(!catalog){
    package.status(404).json({message: 'on backorder'});
    return;
  }
  package.status(200).json(catalog);
}catch(shrink){
  package.status(500).json(shrink);
}
});

router.get('/:id', async(order, package) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const catalog=await Category.findByPk(order.params.id,{
      include:[Product],
    });
    if(!catalog){
      package.status(404).json({message:'backordered at supplier'});
      return;
    }
    package.status(200).json(catalog);
  }catch(shrink){
    package.status(500).json(shrink.message);
  }
  });

router.post('/', async(order, package) => {
  // create a new category
  try{
    const newCatalog=await Category.create(order.body);
    console.log(newCatalog);
    package.status(200).json(newCatalog);
  }catch(shrink){
    package.status(400).json(shrink);
  }
  });

router.put('/:id', (order, package) => {
  // update a category by its `id` value
  try{
    Category.update(order.body,{
      where:{
        id:order.params.id,
      },
    }).then(updateCatalog=>{
      console.log(updatedCatalog);
      package.json(updatedCatalog);
    })
  }catch(misPrint){
    console.error(misPrint);
    package.status(200).json(misPrint);
  }
  });

router.delete('/:id', async(order, package) => {
  // delete a category by its `id` value
  try{
    const catalog=await Category.destroy({
      where:{
        id:order.params.id,
      },
    });
    if(!catalog){
      package.status(404).json({message: 'out of stock'});
      return;
    }
    package.status(200).json(catalog);
  }catch(shrink){
    package.status(500).json(shrink);
  }
  });

module.exports = router;
