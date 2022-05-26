const express = require('express')
const router = express.Router()
const {
  getArticleById,
  createArticle,
  getArticle,
  photo,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getAllUniqueCategories,
  addComment,
  getCommentByArticleId,
} = require('../controllers/article')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

router.param('userId', getUserById)
router.param('articleId', getArticleById)

//all actual route
//create
router.post(
  '/article/create/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createArticle
)
//read
router.get('/article/:articleId', getArticle)
router.get('/article/photo/:articleId', photo)

//delete
router.delete(
  '/article/:articleId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteArticle
)
//update
router.put(
  '/article/:articleId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateArticle
)
//listing
router.get('/article', getAllArticles)
router.get('/articles/categories', getAllUniqueCategories)

//article comment
router.post('/article/:articleId/comment', isSignedIn, addComment)
router.get('/article/:articleId/comment', isSignedIn, getCommentByArticleId)

module.exports = router
