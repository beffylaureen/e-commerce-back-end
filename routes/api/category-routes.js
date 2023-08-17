const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // find all categories
  // be sure to include its associated Products
try{
  const categoryData=await Category.findAll({
    // include:[{model:Product},{model:Tag}]
    include: [Product]
  });
  if(!categoryData){
    res.status(404).json({message: 'on backorder'});
    return;
  }
  res.status(200).json(categoryData);
}catch(err){
  res.status(500).json(err);
}
});

router.get('/:id', async(req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const category = await Category.findOne({
      where: {
        id: req.params.id
      },
      include: [Product]
    });
    if(!category){
      res.status(404).json({message:'backordered at supplier'});
      return;
    }
    res.status(200).json(category);
  }catch(err){
    res.status(500).json(err.message);
  }
  });

router.post('/', async(req, res) => {
  // create a new category
  try{
    const newCategories = await Category.create(req.body);
    console.log(newCategories);
    res.status(200).json(newCategories);
  }catch(err){
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  try{
    Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    }).then(updateCategory => {
      console.log(updateCategory);
      res.status(200).json(updateCategory);
    })
  } catch(error) {
    console.error(error);
    res.status(400).json(error);
  }
  });

router.delete('/:id', async(req, res) => {
  // delete a category by its `id` value
  try{
    const catalog=await Category.destroy({
      where:{
        id:req.params.id,
      },
    });
    if(!catalog){
      res.status(404).json({message: 'out of stock'});
      return;
    }
    res.status(200).json(catalog);
  }catch(err){
    res.status(500).json(err);
  }
  });

module.exports = router;
