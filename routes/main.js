const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

router.get(["/", "/home"],
    asyncHandler(async(req, res) => {
        const locals = {
            title: "Home",
        }
        const data = await Post.find();
        res.render("index", {locals, data, layout: mainLayout});
    })
);

router.get("/about", (req, res) => {
    const locals = {
        title: "About",
    }
    res.render("about", {locals, layout: mainLayout});
});

/**
 * 게시물 상세 보기
 * Get /post/:id
 */
router.get("/post/:id",
    asyncHandler(async (req, res) =>{
        const data = await Post.findOne({_id: req.params.id});
        res.render("post", {data, layout: mainLayout});
    })
);

module.exports = router;

// Post.insertMany([
//     {title: "제목1", body: "내용1 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목2", body: "내용2 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목3", body: "내용3 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목4", body: "내용4 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목5", body: "내용5 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목6", body: "내용6- Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목7", body: "내용7- Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목8", body: "내용8 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목9", body: "내용9 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목10", body: "내용10 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목11", body: "내용11 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
//     {title: "제목12", body: "내용12 - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."},
// ]);
