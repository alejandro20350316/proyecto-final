const { Router } = require("express");

const {
  listSongs, listSongsByID, addSong,deteleSong,updateSong, 
  
} = require("../controllers/users");

const router = Router();

//http://localhost:3000/api/v1/spotify50
// Rutas

router.get('/', listSongs); 
router.get("/:id", listSongsByID); 
router.put("/", addSong); 
router.patch("/:id", updateSong); 
router.delete("/:id", deteleSong); 

module.exports = router;
