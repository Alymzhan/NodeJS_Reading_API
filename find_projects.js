/*Create http-server, read all data from BOM API and download JSON-file, 
show filtered results with links on http://localhost:8080/
Projects with status "In-Progress"*/

var http = require('http');
var unirest = require('unirest');
const fs = require('fs')

var req = unirest('GET', 'https://api.bomfusion.ctechmanufacturing.com/api/batches/in-process')
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
        fs.writeFile('inprocess.json', res.raw_body, function (err) {
            if (err) throw err;
            console.log('File downloaded!');
            
            const fileContents = fs.readFileSync('./inprocess.json', 'utf8')
            const data = JSON.parse(fileContents)     
      
            console.log('Start Server: http://localhost:8080/');
            http.createServer(function (req, res) {
              res.writeHead(200, {'Content-Type': 'text/html'});
              
              for (var job of data.Jobs) 
              { 
                if (job.Itemid.match(/FIXED.*/) && !job.Itemid.match(/FIXED_SHLF.*/) && !job.Itemid.match(/FIXED_DIV.*/)) 
                { 
                  
                  res.write(job.Itemid + ": <a href=\"https://toekick.ctechmanufacturing.com/BOMDB/GetProject?projectNumber=" + job.ProjectNumber + "\" target=\"_blank\" rel=\"noopener noreferrer\"> ProjectNumber: "+job.ProjectNumber+"</a>"); 
                  res.write("<br />");
                } 
              
                if (job.Itemid.match(/FLAT_TOP.*/)) 
                { 
                  res.write(job.Itemid + ": <a href=\"https://toekick.ctechmanufacturing.com/BOMDB/GetProject?projectNumber=" + job.ProjectNumber + "\" target=\"_blank\" rel=\"noopener noreferrer\"> ProjectNumber: "+job.ProjectNumber+"</a>"); 
                  res.write("<br />");
                } 
              }
            
              res.end();  
            }).listen(8080);
        });
  });
  


