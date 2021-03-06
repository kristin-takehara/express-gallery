// jshint esversion: 6

const express = require('express');
const router = express.Router();
const db = require('../models');
const Photo = db.photo;


//get all photos in gallery
router.get('/', (req, res) => {
  return Photo.findAll()
  .then(photos => {
    let locals = { photos : photos};
    return res.render('./index', locals);
  })
  .catch((err) => {
    let message = { message : 'Unable to locate your photo. Please try again.'};
    res.render('./error', message);
  });
});

//get new photo submission form page
router.get('/new', (req, res) => {
  res.render('./new');
});

//create new gallery photo and post to gallery
router.post('/', (req, res) => {
  console.log('req.user', req.user);
  const author = req.body.author;
  const link = req.body.link;
  const description = req.body.description;
//link must be an http url
  if(link.includes('http') || (link.includes('JPG'))) {
    return Photo.create({ author: author, link: link, description: description, userId: req.user.id})
    .then(newPhoto => {
      // //res.render()
      return res.redirect('/gallery');
    })
    .catch((err) => {
      let message = { message : 'Sorry, we cannot accept your submission at this time. Please try again'};
      res.render('./error', message);
    });
  }else{
    let message = { message: 'Please submit a valid url OR .jpg file'};
    res.render('./error', message);
  }
});

//get photo by id in gallery
router.get('/:id', (req, res) => {
  const photoId = req.params.id;

  return Photo.findAll({
    where: {
      id: [(photoId), (parseInt(photoId)+1), (parseInt(photoId)+2), (parseInt(photoId)+3)]
    },
  })
  .then(photo => {
    console.log('photo', photo);
    let locals = { mainPhoto : photo[0], photos : [photo[1], photo[2], photo[3]]};
    return res.render('./photo', locals);
  });
});

router.put('/:id', (req, res) => {
  let newInfo = req.body;
  let photoId = req.params.id;
  return Photo.findById(photoId)
  .then(photo => {
    if(req.user.id === photo.userId){
      return Photo.update(newInfo, {
        where: [{id: photoId}]
      })
      .then(photo => {
        return res.redirect(`/gallery/${photoId}`);
      });
    }
  });
});

router.delete('/:id', (req, res) => {
  let photoId = req.params.id;
  return Photo.findById(photoId)
  .then(photo => {
    if(req.user.id === photo.userId){
      return Photo.destroy({
        where: [{id: photoId}]
      })
      .then(photo => {
        return res.redirect('/gallery');
      });
    }
  });
});


//render edit page for photos(can only edit author??? and description)
router.get('/:id/edit', (req, res) => {
  const photoId = req.params.id;
  console.log(req.params.id);
  return Photo.findById(photoId)
    .then(photo => {
      let locals = photo.dataValues;
      return res.render('./edit', locals);
    });
});

module.exports = router;
