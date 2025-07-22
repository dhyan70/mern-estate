import express from "express";
import { getBookMark } from "../Controller/listing.controller.js";
import { getAllMybookmarks } from "../Controller/listing.controller.js";
const router = express.Router();
import { addBookmark } from "../Controller/bookmarks.controller.js";
router.post('/addremove', addBookmark);
router.get("/mybookmarks", getAllMybookmarks)
router.get("/getbookmark" , getBookMark)

export default router;