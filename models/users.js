const spotifyModels = {
  // Obtener todos los registros de la tabla 'spotify50'
  getAll: `
   SELECT 
     * 
   FROM 
      spotify50`,

  // Obtener una canción por su ID
  getByID: `
 SELECT
   *
 FROM
   spotify50
 WHERE
   id = ?`,

  // Insertar una nueva canción en la tabla 'spotify50'
  addRow: `
  INSERT INTO spotify50 (
    id,
    Country,
    Track_Name,
    Artist_Name,
    Album_Name,
    Popularity,
    Date,
    Markets,
    Danceability,
    duration,
    Energy,
    Key_1
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

  deleteRow: `DELETE
  FROM
        spotify50
  WHERE 
        id = ?`,

  updateSongs: `
        UPDATE spotify50
        SET 
          Country = ?,
          Track_Name = ?,
          Artist_Name = ?,
          Album_Name = ?,
          Popularity = ?,
          Date = ?,
          Markets = ?,
          Danceability = ?,
          duration = ?,
          Energy = ?,
          Key_1 = ?
        WHERE id = ?
      `,
};
module.exports = spotifyModels;
