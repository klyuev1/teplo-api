/* eslint-disable */
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.downloadRooms = (data) =>

{
  return new Promise((resolve, reject) => {
    const csvWriter = createCsvWriter({
      path: './controllers/output.csv',
      header: [
        { id: 'tOutside', title: 'Температура снаружи' },
        { id: 'tInside', title: 'Температура внутрь' },
        { id: 'rWall', title: 'Коэффициент теплопередачи стены' },
        { id: 'rWindow', title: 'Коэффициент теплопередачи окна' },
        { id: 'beta', title: 'Коэффициент на сторону света' },
        { id: 'kHousehold', title: 'Бытовой коэффициент' },
        { id: 'number', title: 'Номер' },
        { id: 'name', title: 'Наименование' },
        { id: 'height', title: 'Высота' },
        { id: 'width', title: 'Ширина' },
        { id: 'areaWall', title: 'Площадь оконного проема' },
        { id: 'areaRoom', title: 'Площадь стены' },
        { id: 'heatLoss', title: 'Теплопотери' },
      ],
      encoding: 'utf8'
    });

    csvWriter.writeRecords(data)
      .then(() => {
        console.log('CSV файл создан');
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}