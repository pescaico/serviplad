
createPdf  =  function() {
var columns = [
    {title: "ID", dataKey: "id"},
    {title: "Name", dataKey: "name"}, 
    {title: "Country", dataKey: "country"}];
var rows = [
    {"id": 1, "name": "Shaw", "country": "Tanzania"},
    {"id": 2, "name": "Nelson", "country": "Kazakhstan"},
    {"id": 3, "name": "Garcia", "country": "Madagascar"}];
 
var doc = new jsPDF('p', 'pt');
doc.autoTable(columns, rows, {
    styles: {fillColor: [100, 255, 255]},
    columnStyles: {
        id: {fillColor: 255}
    },
    margin: {top: 60},
    beforePageContent: function(data) {
        doc.text("Header", 40, 30);
    }
});
doc.save('table.pdf');
};