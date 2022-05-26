const Article = require('../models/article')
const Comment = require('../models/comment')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

exports.getArticleById = (req, res, next, id) => {
  Article.findById(id)
    .populate('category')
    .exec((err, article) => {
      if (err) {
        return res.status(400).json({
          error: 'Article not found',
        })
      }
      req.article = article
      next()
    })
}

exports.createArticle = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'problem with image',
      })
    }
    //destructure the fields
    const { title, body, category } = fields
    if (!title || !body || !category) {
      return res.status(400).json({
        error: 'please include all fields',
      })
    }

    let article = new Article(fields)
    //handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'file size too big',
        })
      }
      article.photo.data = fs.readFileSync(file.photo.path)
      article.photo.contentType = file.photo.type
    }
    //save into db
    article.save((err, article) => {
      if (err) {
        res.status(400).json({
          error: 'saving article in db failed',
        })
      }
      res.json(article)
    })
  })
}

exports.getArticle = (req, res) => {
  req.article.photo = undefined
  return res.json(req.article) //fixed
}
//middleware for optimization
exports.photo = (req, res, next) => {
  if (req.article.photo.data) {
    res.set('Content-Type', req.article.photo.contentType)
    return res.send(req.article.photo.data)
  }
  next()
}

exports.deleteArticle = (req, res) => {
  let article = req.article
  // console.log(article);
  // if (!article) return res.send("no articles found");
  article.remove((err, deletedarticle) => {
    if (err) {
      return res.status(400).json({
        error: 'failed to delete article',
      })
    }
    res.json({ message: 'deletion success', deletedarticle })
  })
}

//updating article
exports.updateArticle = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'problem with image',
      })
    }
    //updation code
    let article = req.article
    article = _.extend(article, fields)
    //handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'file size too big',
        })
      }
      article.photo.data = fs.readFileSync(file.photo.path)
      article.photo.contentType = file.photo.type
    }
    //save into db
    article.save((err, article) => {
      if (err) {
        res.status(400).json({
          error: 'updation of article failed',
        })
      }
      res.json(article)
    })
  })
}
//article listing
exports.getAllArticles = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  Article.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, articles) => {
      if (err) {
        return res.status(400).json({
          error: 'No article found',
        })
      }
      res.json(articles)
    })
}
//getting all categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('category', {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'No category found',
      })
    }
    res.json(category)
  })
}

//article comments

exports.addComment = async (req, res) => {
  const articleId = req.params.articleId
  const comment = new Comment({
    text: req.body.text,
    article: articleId,
  })
  await comment.save()
  const postRelated = await Article.findById(articleId)
  postRelated.comments.push(comment)
  await postRelated.save((err, article) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to add comment',
      })
    }
    res.json(article)
  })
}

exports.getCommentByArticleId = async (req, res) => {
  const articleId = req.params.articleId
  const comment = await Comment.find({ article: articleId })
  if (!comment) {
    return res.status(400).json({
      error: 'No comment found',
    })
  }
  res.json(comment)
}
