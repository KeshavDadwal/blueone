import dbConnection from '../../lib/dbConnection';

export default async function handler(req, res) {
  try {
    const connection = await dbConnection();
    const [rows] = await connection.execute('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
