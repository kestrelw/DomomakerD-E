const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age/* || !req.body.rarity*/) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    rarity: req.body.rarity || Math.floor(Math.random() * 5 +1),
    owner: req.session.account._id,
  };

  console.log(domoData);

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    // req.session.domo = Domo.toAPI(newDomo);
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, rarity: newDomo.rarity });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};//

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
