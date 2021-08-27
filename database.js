var mongoose = require('mongoose');
mongoose.connect(
    "mongodb+srv://username:password@cluster0.wfhad.mongodb.net/dbname?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('Connection to database is established');
    })
    .catch(e => {
        console.log('DB Error\n', e);
    });