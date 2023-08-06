var express = require('express');
var app = express();

app.listen(7000);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');

});
app.post('/',function(req,res)){
    var name = res.body.name;
    var age = res.body.age;
    var number = res.body.number;
    var id = res.body.id;
    con.connect(fuction(error)){
        if(error) throw error;
        var sql = "Insert into Appointment values('"+id+"','"+id+"','"+id+"','"+id+"')(?,?,?)";
        con.query(sql,[name,age,number,id],funcion(error,result)){
            if(error) throw error
            res.send("Appointment Successful"+result.isertId);
        }
    }
}

var con = require("./connections");



