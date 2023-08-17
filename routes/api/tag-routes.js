const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const productSKU=await Tag.findAll({
      include:[{Product}]
    });
    res.status(200).json(productSKU);
  }catch(err){
    res.status(500).json(err);
  }
 });

router.get('/:id', async(req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const productSKU=await Tag.findByPk(req.params.id,{
      include:[{model:Product}]
    });
    if(!productSKU){
      res.status(404).json({message: 'item not available'});
      return;
    }
    res.status(200).json(productSKU);
  }catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const productSKU=await Tag.create(req.body);
    res.status(200).json(productSKU);
  }catch(err){
    res.status(400).json(err);
  }
});

router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value
  try{
    const newTag=await Tag.update(req.body,{
      where:{
        id:req.params.id,
      }
    })
    console.log(newTag);
    res.status(200).json()
  }catch(err){
    res.status(500).json(err.message)
  }
});

router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  try{
    const prodTag=await Tag.destroy({
      where:{
        id:req.params.id,
      },
    });
    if(!prodTag){
      res.status(404).json({message: 'item not available'});
      return;
    }
    res.status(200).json(prodTag);
  }catch(err){
    res.status(500).json(err.message)
  }
});

module.exports = router;
