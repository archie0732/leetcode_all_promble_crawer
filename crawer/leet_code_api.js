const axios = require('axios');
const fs = require('fs').promises; // Using fs.promises for Promises
const excel = require('xlsx');

const url = 'https://leetcode.com/api/problems/all/';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
};

axios
  .get(url, { headers })
  .then((response) => {
    const jsonData = response.data;
    const problems = jsonData.stat_status_pairs;

    let problems_data = [];

    // Output problem title and level
    for (const i in problems) {
      problems_data.push({
        title: problems[i].stat.question__title,
        level: problems[i].difficulty.level,
      });
    }

    mkxlsx(problems_data, 'test', 'leetcode_api');
  })
  .catch((error) => {
    console.error('API 请求错误:', error.message);
  });

// Create Excel file function
async function mkxlsx(data, file_path, file_name) {
  const workbook = excel.utils.book_new();
  const worksheet = excel.utils.json_to_sheet(data);

  // Append the worksheet to the workbook
  excel.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

  // Use absolute path to ensure file writing accuracy
  const absolutePath = `${__dirname}/${file_name}.xlsx`;

  try {
    // Use fs.promises.writeFile which returns a Promise
    await fs.writeFile(
      absolutePath,
      excel.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    );
    console.log('創建成功', absolutePath);
  } catch (err) {
    console.log('創建失敗:', err.message);
  }
}
