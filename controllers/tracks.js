
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const { Readable } = require('stream');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoURI = 'mongodb://localhost:27017/trackDB';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('tracks');
});



module.exports = {

// @route POST /upload
// @desc  Display all files in JSON
 uploadTrack : async  (req, res) => {
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
  // upload vetioj single array
  upload.single('track')(req, res, (err) => {
    // if (err) {
    //   return res.status(400).json({ message: "Upload Request Validation Failed" });
    // } else if(!req.body.name) {
    //   return res.status(400).json({ message: "No track name in request body" });
    // }
    
    //let trackName = req.body.name;
    // delete extension form the name
    let trackName = req.file.originalname.substring(0, req.file.originalname.lastIndexOf('.'));
    
    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    // jei multiple vietoj file req.files
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);
    
    let bucket = new mongodb.GridFSBucket(conn.db, {
      bucketName: 'tracks'
    });
 
    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);
 
    uploadStream.on('error', () => {
      return res.status(500).json({ message: "Error uploading file" });
    });
 
    uploadStream.on('finish', () => {
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
    });
  });
},
// @route POST /uploads
// @desc  Upload multiple tracks
uploadTracks : async  (req, res) => {
 const storage = multer.memoryStorage()
 const upload = multer({ storage: storage});
 // upload vetioj single array
 upload.array('track', 10)(req, res, (err) => {

  let bucket = new mongodb.GridFSBucket(conn.db, {
   bucketName: 'tracks'
 });

console.log(req.files);
  for(let i = 0; i<req.files.length; i++) {
   console.log(req.files.length)
   let trackName = req.files[i].originalname.substring(0, req.files[i].originalname.lastIndexOf('.'));
   const readableTrackStream = new Readable();

   // Covert buffer to Readable Stream
   // jei multiple vietoj file req.files
   readableTrackStream.push(req.files[i].buffer);
   readableTrackStream.push(null);
   
   let uploadStream = bucket.openUploadStream(trackName);
   let id = uploadStream.id;
   readableTrackStream.pipe(uploadStream);

   console.log(readableTrackStream)
  }

  return res.status(200).json({
   err: 'success'
 });
 //  uploadStream.on('error', () => {
 //   return res.status(500).json({ message: "Error uploading file" });
 // });

 // uploadStream.on('finish', () => {
 //   return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
 // });

 
 });
},

// @route GET /files
// @desc  Display all files in JSON
 getAllTracks : async  (req, res) => {
  gfs.files.find().toArray((err, files) => {
   // Check if files
   if (!files || files.length === 0) {
     return res.status(404).json({
       err: 'No files exist'
     });
   }
   // Files exist
   return res.json(files);
 });
},
// @route GET /files/:filename
// @desc  Display single file object
 getTrackObject : async  (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
   // Check if file
   if (!file || file.length === 0) {
     return res.status(404).json({
       err: 'No file exists'
     });
   }
   // File exists
   return res.json(file);
 });
},

// @route GET /tracks/:filename
// @desc Display Audio
getTrackURL : async  (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
  });
},

// @route DELETE /tracks/:id
// @desc Delete Audio file
deleteTrack : async  (req, res) => {
 gfs.remove({ _id: req.params.id, root: 'tracks' }, (err, gridStore) => {
  if (err) {
    return res.status(404).json({ err: err });
  }
  return res.status(200).json({
   err: 'File deleted successfully'
 });
});
}
}
