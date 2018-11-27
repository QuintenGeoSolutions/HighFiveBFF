const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const sql = require('mssql');
const uuidv1 = require('uuid/v1');

const config = {
    user: 'highfiveadmin',
    password: 'GSxvG3HY3cjMGLUn',
    server: 'highfiveappdb.database.windows.net',
    database: 'HighFiveAppDb',
    encrypt:true
};
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

var executeQuery = function(res,query,parameters){
    sql.connect(config,function(err){
        if(err){
            console.log("there is a database connection error -> "+err);
            res.send(err);
        }
        else{
            // create request object
            var request = new sql.Request();

            // Add parameters
            parameters.forEach(function(p) {
                request.input(p.name, p.sqltype, p.value);
            });

            // query to the database
            request.query(query,function(err,result){
                if(err){
                    console.log("error while querying database -> "+err);
                    res.send(err);
                }
                else{
                    res.send(result);
                    sql.close();
                }
            });
        }
    });
};

app.get('/',function(req, res){
    res("Hello world!")
});

app.post('/', function (req, res) {

    var parameters = [
        { name: 'Id', sqltype: sql.NVarChar, value: uuidv1()},
        { name: 'CreatedAt', sqltype: sql.DateTimeOffset(7), value: new Date()},
        { name: 'ModifiedAt', sqltype: sql.DateTimeOffset(7), value: new Date()},
        { name: 'FirstName', sqltype: sql.NVarChar, value: req.body.FirstName},
        { name: 'LastName', sqltype: sql.NVarChar, value: req.body.LastName},
        { name: 'Email', sqltype: sql.NVarChar, value: req.body.Email},
        { name: 'PhoneNumber', sqltype: sql.NVarChar, value: req.body.PhoneNumber},
        { name: 'Sex', sqltype: sql.NVarChar, value: req.body.Sex},
        { name: 'UserType', sqltype: sql.Int, value: req.body.UserType},
        { name: 'UserTypeOther', sqltype: sql.NVarChar, value: req.body.UserTypeOther},
        { name: 'Organisation', sqltype: sql.NVarChar, value: req.body.Organisation},
        { name: 'WristBandNumber', sqltype: sql.NVarChar, value: req.body.WristBandNumber},
        { name: 'Scanned', sqltype: sql.Bit, value: false},
    ];

    var query = "INSERT INTO [dbo].[User] (Id, CreatedAt, ModifiedAt, FirstName, LastName, Email, PhoneNumber, Sex, UserType, UserTypeOther, Organisation, WristBandNumber, Scanned) VALUES (@Id, @CreatedAt, @ModifiedAt, @FirstName, @LastName, @Email, @PhoneNumber, @Sex, @UserType, @UserTypeOther, @Organisation, @WristBandNumber, @Scanned)";
    executeQuery (res, query, parameters);
});

var server = app.listen(process.env.PORT ||5000, function () {
    console.log('Server is running..');
});
