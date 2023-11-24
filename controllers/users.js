//importacion de modulos
const { request, response } = require("express");
const userModel = require("../models/users");
const pool = require("../db");

//###########################################################

//              ENDPOINT'S --> OPERACIONES CRUD

//###########################################################

//################ mostrar todo #############################
// http://localhost:3000/api/v1/spotify50
const listSongs = async (req = request, res = response) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const playersAll = await conn.query(userModel.getAll, (err) => {
      if (err) {
        throw err;
      }
    });

    res.json({ msg: "RESULTADO", playersAll });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

//######################## BUSCAR POR ID #################################
const listSongsByID = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({ msg: "Invalid ID" });
    return;
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const [song] = await conn.query(userModel.getByID, [id]);

    //si el id proporcionado no se encunetra en la base de datos
    //Se muestra un mensaje indicándolo.
    if (!song) {
      res.status(404).json({ msg: "Player not found" });
      return;
    }
    //si el ID es valido y se cuentra en la BD se mostraran los datos de este
    //en formato JSON
    res.json({ msg: "RESULTADO", song });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end(); //cierra la conexion
  }
};

//######################## AÑADIR NUEVA CANCION #################################
const addSong = async (req = request, res = response) => {
  // Extrae los datos del cuerpo de la solicitud (request)
  const {
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
    Key_1,
  } = req.body;

  // se Verifica si algún campo obligatorio falta en la solicitud
  if (
    !id ||
    !Country ||
    !Track_Name ||
    !Artist_Name ||
    !Album_Name ||
    !Popularity ||
    !Date ||
    !Markets ||
    !Danceability ||
    !duration ||
    !Energy ||
    !Key_1
  ) {
    res.status(400).json({ msg: "Missing information" });
    return;
  }

  // Crea un arreglo con los datos del jugador
  const song = [
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
    Key_1,
  ];

  let conn;

  try {
    conn = await pool.getConnection();

    const [existinSong] = await conn.query(userModel.getByID, [id]);

    if (existinSong) {
      res.status(409).json({ msg: `ID:(${id}) already exists` });

      return;
    }

    const songAdded = await conn.query(userModel.addRow, [...song]);

    if (songAdded.affectedRows === 0) {
      throw new Error({ message: "Failed to add song" });
    }

    res.json({ msg: "Song added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

// ############################# ACTUALIZAR ############################
const updateSong = async (req = request, res = response) => {
  let conn;

  const { id } = req.params; 


  const {
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
    Key,
  } = req.body;

  let song = [
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
    Key,
  ];

  try {
  
    conn = await pool.getConnection();

    const [songExists] = await conn.query(
      userModel.getByID,
      [id],
      (err) => {
        throw err;
      }
    );


    if (!songExists) {
      res.status(404).json({ msg: `Song '${id}' not found` });
      return;
    }

    let oldSong = [
      songExists.Country,
      songExists.Track_Name,
      songExists.Artist_Name,
      songExists.Album_Name,
      songExists.Popularity,
      songExists.Date,
      songExists.Markets,
      songExists.Danceability,
      songExists.duration,
      songExists.Energy,
      songExists.Key,
    ];

    song.forEach((songData, index) => {
      if (!songData) {
        song[index] = oldSong[index];
      }
    });

    const songUpdated = await conn.query(
      userModel.updateSongs,
      [...song, id],
      (err) => {
        if (err) throw err;
      }
    );

    if (songUpdated.affectedRows === 0) {
      throw new Error("Song not updated");
    }

    res.json({ msg: "Song updated successfully", ...oldSong });
  } catch (err) {

    res.status(400).json(err);
    return;
  } finally {

    if (conn) conn.end();
  }
};

//############################## BORRAR CANCION ########################
const deteleSong = async (req = request, res = response) => {
  let conn;
  const { id } = req.params;

  try {
    conn = await pool.getConnection();
    //se obtiene el ID pasado como paramrtro  en la url
    const [songExists] = await conn.query(userModel.getByID, [id], (err) => {
      throw err;
    });
    //si el ID no se encuentra en la base de datos se manda un mesaje indicando no encontrado
    if (!songExists || songExists.id === 0) {
      res.status(404).json({ msg: "Song not found" });
      return;
    }

    const songDelete = await conn.query(userModel.deleteRow, [id], (err) => {
      if (err) throw err;
    });
    // en caso de error se manda un mensaje indicandolo
    if (songDelete.affectedRows === 0) {
      throw new Error({ message: "Failed to delete player" });
    }
    //mensaje indicando que el jugador fue borrado exitosamente
    res.json({ msg: `Player delete ('${id}') successfully ` });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  listSongs,
  listSongsByID,
  deteleSong,
  addSong, updateSong
};
