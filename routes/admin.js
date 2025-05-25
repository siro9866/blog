const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

/**
 * 로그인체크
 */
const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.redirect("/admin");
    }else{
        try{
            const decoded = jwt.verify(token, jwtSecret);
            req.userId = decoded.userId;
            next();
        }catch(error){
            res.redirect("/admin");
        }
    }
}

router.get('/admin', (req, res) => {
    const locals = {title: "관리자 페이지"}
    res.render("./admin/index", {locals, layout: adminLayout2})
});

router.post("/admin", asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({message: "일치하는 사용자가 없습니다."})
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword){
        return res.status(401).json({message: "비밀번호가 일치하지 없습니다."})
    }

    const token = jwt.sign({id: user._id}, jwtSecret);
    res.cookie("token", token, {httpOnly: true});
    res.redirect("/allPosts");

}));

/**
 * View Registe Form
 * Get /register
 */
router.get("/register", asyncHandler(async (req, res) => {
    res.render("admin/index", {layout: adminLayout2})
}));

/**
 * Register Administrator
 * Post /register
 */
router.post("/register", asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword
    })
    // res.json(`user created: ${user}`);
}));

/**
 * Get all Posts
 * Get /allPost
 */
router.get(
    "/allPosts",
    checkLogin,
    asyncHandler(async (req, res) => {
    const locals = {title: "Posts"}
    const data = await Post.find()
    res.render("admin/allPosts", {locals, data, layout: adminLayout})
}));

/**
 * Admin logout
 * Get /logout
 */
router.get("/logout", asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
}))

/**
 * Admin = Add Post
 * Get /add
 */
router.get(
    "/add",
    checkLogin,
    asyncHandler(async (req, res) => {
    const locals = {title: "게시물 작성"};
    res.render("admin/add", {locals, layout: adminLayout})
}));

/**
 * Admin - Add Post
 * Post /add
 */
router.post("/add", checkLogin, asyncHandler(async (req, res) => {
    const {title, body} = req.body;
    const newPost = new Post({
        title: title,
        body: body
    });
    await Post.create(newPost);
    res.redirect("/allPosts");
}));

/**
 * Admin - Edit Get
 * Put /edit/:_id
 */
router.get("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    const locals = {title: "게시물 편집"}
    const data = await Post.findOne({_id: req.params.id});
    res.render("admin/edit", {locals, data, layout: adminLayout})
}));

/**
 * Admin - Edit Put
 * Put /edit/:_id
 */
router.put("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
       title: req.body.title,
       body: req.body.body,
       createdAt: Date.now()
    });
    res.redirect("/allPosts")
}));

/**
 * Admin - Delete delete
 * Delete /delete/:id
 */
router.delete("/delete/:id", checkLogin, asyncHandler(async (req, res) => {
    await Post.deleteOne({_id: req.params.id});
    res.redirect("/allPosts");
}));

module.exports = router;