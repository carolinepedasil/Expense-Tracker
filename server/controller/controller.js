const model = require('../models/model');

async function create_Categories(req, res) {
    const create = new model.Categories({
        type: 'Investment',
        color: '#FCBE44',
    });

    await create.save(function(error){
        if(!error) return res.json(create);
        return res.status(400).json({ message : `Error while creating categories ${error}` });
    });
}

async function get_Categories(req, res) {
    let data = await model.Categories.find({})

    let filter = await data.map(value => Object.assign({}, { type: value.type, color: value.color }));
    return res.json(filter);
}

async function create_Transaction(req, res) {
    if(!req.body) return res.status(400).jdon('Post HTTP data not provided');
    let { name, type, amount } = req.body;

    const create = await new model.Transaction({
        name,
        type,
        amount,
        date: new Date()
    });

    create.save(function(error) {
        if(!error) return res.json(create);
        return res.status(400).json({ message: `Error while creating transaction ${error}` })
    })
}

async function get_Transaction(req, res) {
    let data = await model.Transaction.find({});
    return res.json(data);
}

async function delete_Transaction(req, res) {
    if(!req.body) res.status(400).json({ message: 'Request body not found' });
    await model.Transaction.deleteOne(req.body, function(error){
        if(!error) res.json('Record deleted!');
    }).clone().catch(function(error) {
        res.json('Error while deleting transaction record');
    })
}

async function get_Labels(req, res) {
    model.Transaction.aggregate([
        {
            $lookup : {
                from: 'categories',
                localField: 'type',
                foreignField: 'type',
                as: 'categories_info'
            }
        },
        {
            $unwind: '$categories_info'
        }
    ]).then(result => {
        let data = result.map(value => Object.assign({}, { _id: value._id, name: value.name, type: value.type, amount: value.amount, color: value.categories_info['color'] }));
        res.json(data);
    }).catch(error => {
        res.status(400).json('Lookup Collection Error');
    });
}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}
