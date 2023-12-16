// /* eslint-disable */
// const router = require('express').Router();
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// function generateCSV() {
//   return new Promise((resolve, reject) => {
//     const csvWriter = createCsvWriter({
//       path: './routes/output.csv',
//       header: [
//         { id: 'name', title: 'Name' },
//         { id: 'age', title: 'Age' },
//       ]
//     });

//     const data = [
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ];

//     csvWriter.writeRecords(data)
//       .then(() => {
//         console.log('CSV файл создан');
//         resolve();
//       })
//       .catch((err) => {
//         console.error(err);
//         reject(err);
//       });
//   });
// }

// router.get('/download', async (req, res) => {
//   console.log(req)
//   try {
//     await generateCSV(); // Дожидаемся создания файла
//     const filePath = __dirname + '/output.csv';
//     res.download(filePath); // Отправляем клиенту файл для скачивания
//   } catch (error) {
//     console.error('Ошибка при создании CSV файла:', error);
//     res.status(500).send('Ошибка при создании файла');
//   }
// });

// module.exports = router;
