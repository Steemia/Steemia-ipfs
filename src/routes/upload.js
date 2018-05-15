import ipfsAPI from "ipfs-api";
import multer, { diskStorage } from "multer";
import { join } from "path";
import { unlink, readFileSync } from "fs";
import { Router } from "express";

// Create an instance of Express Router
let router = Router();

const MAX_SIZE = process.env.MAX_SIZE || 52428800;

// Create the diskStorage with the destination and filename for the uploaded file
const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, join(__dirname, './uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

// create an instance of multer with the storage initialization
const upload = multer({ storage });

// create an instance of ipfs API
const ipfs = ipfsAPI({
  host: '127.0.0.1',
  port: process.env.PORT || 5001,
  protocol: 'http' // should be replaced to https in production manually
});


/**
 * POST endpoint for upload route
 */
router.post('/', upload.single('file'), (req, res) => {

  // First check if there is a file being uploaded
  if (!req.file) {
    return res.status(422).json({
      error: 'File needs to be provided.',
    });
  }

  const mime = req.file.mimetype;

  // If there is a file, check its mimetype to determine it is an image
  if (mime.split('/')[0] !== 'image') {
    unlink(req.file.path);

    return res.status(422).json({
      error: 'File needs to be an image.',
    });
  }

  const fileSize = req.file.size;

  // If the file size is larger than the max file size, reject it
  if (fileSize > MAX_SIZE) {
    unlink(req.file.path);

    return res.status(422).json({
      error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
    });
  }

  // read the file data from fs
  const data = readFileSync(req.file.path);

  // distribute the file to other ipfs nodes in the tree
  return ipfs.add(data, (err, files) => {
    unlink(req.file.path); // remove the file from fs in order to save space

    // If file was uploaded correctly, return its hash representation
    if (files) {
      return res.json({
        hash: files[0].hash,
      });
    }

    // Otherwise, return an error
    return res.status(500).json({
      error: err,
    });
  });
});

/**
 * GET endpoint for upload route
 */
router.get('/', (req, res) => {
  res.send('Upload endpoint!');
});

export default router;