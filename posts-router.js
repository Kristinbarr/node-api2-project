const express = require('express')
const db = require('./data/db')
const router = express.Router()

// GET /api/posts - Returns an array of all the post objects contained in the database.
router.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.find()
    res.status(200).json(posts)
    
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.' })
  }
})

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/api/posts/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        return res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })

})

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/api/posts/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length === 0) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      } else {
        res.status(200).json(comments)
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' })
    })
})

// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post('/api/posts', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  }
  db.insert(req.body)
    .then(id => {
      res.status(201).json(id)
    })
    .catch(error => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database',
      })
    })
})

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/api/posts/:id/comments', (req, res) => {
  if (!req.body.text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' })
  } else if (req.body.post_id !== Number(req.params.id)) {
    res
      .status(400) 
      .json({ message: 'The specified post ID does not match the request ID.' })
  } else if (!db.findById(req.params.id)) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else {
    db.insertComment(req.body)
      .then(newComment => {
        return res.status(201).json(newComment)
      })
      .catch(error => {
        res.status(500).json({
          error: 'There was an error while saving the post to the database',
        })
      })
  }

})

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/api/posts/:id', (req, res) => {
  db.remove(req.params.id)
  .then(removedPost => {
    if (!removedPost) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      res.status(200).json(removedPost)
    }
  })
  .catch(error => {
    res.status(500).json({
      error: "The post could not be removed"
    })
  })
})

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/api/posts/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  }
  db.update(req.params.id, req.body)
  .then(updatedPost => {
    if (updatedPost) {
      res.status(200).json(updatedPost)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The post information could not be modified." })
  })
})

module.exports = router
