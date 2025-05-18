import axios from 'axios';

const VITE_APP_ID = import.meta.env.VITE_APPSHEET_APP_ID;
const VITE_ACCESS_KEY = import.meta.env.VITE_APPSHEET_ACCESS_KEY;

async function FetchAppSheet(tableName: string) {
  const apiUrl = `https://api.appsheet.com/api/v2/apps/${VITE_APP_ID}/tables/${tableName}/Action`;

  const requestBody = {
    Action: 'Find',
    Properties: {}, // 必要に応じてフィルタリング条件などをここに記述できます
    Rows: [],
  };

  const config = {
    headers: {
      'ApplicationAccessKey': VITE_ACCESS_KEY,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, config);
    return response.data;
  } catch (error :any) {
    console.error("APIリクエスト中にエラーが発生しました:", error.response ? error.response.data : error.message);
    throw error; // エラーを呼び出し元に伝える
  }
}

export default FetchAppSheet;