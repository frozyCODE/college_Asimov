const db = require("../config/db");

class ClasseModel {
  static async findAll() {
    const [rows] = await db.execute(
      `SELECT * FROM Classes ORDER BY annee_scolaire DESC, niveau ASC, lettre ASC`,
    );
    return rows;
  }
  static async create(data) {
    const { annee_scolaire, niveau, lettre } = data;
    const [result] = await db.execute(
      `INSERT INTO Classes (annee_scolaire, niveau, lettre) VALUES (?, ?, ?)`,
      [annee_scolaire, niveau, lettre],
    );
    return result.insertId;
  }

  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM Classes WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}
module.exports = ClasseModel;
