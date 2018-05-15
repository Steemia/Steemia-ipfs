import { Router } from "express";

// Initialize a new instance of Express Router
let router = Router();

/**
 * GET route for index page
 */
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Steemia IPFS' 
  });
});

export default router;