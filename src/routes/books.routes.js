import express from "express";
import { Book } from "../models/books.model.js";

const router = express.Router();

const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: "Invalid book id" });
  }
  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.book = book;
  next();
};

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  const requiredFields = [title, author, genre, publication_date];
  if (!requiredFields.every((field) => field)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newBook = new Book({
    title,
    author,
    genre,
    publication_date,
  });
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

router.put("/:id", getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  const requiredFields = [title, author, genre, publication_date];
  if (!requiredFields.every((field) => field)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  res.book.title = title;
  res.book.author = author;
  res.book.genre = genre;
  res.book.publication_date = publication_date;
  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (title) {
    res.book.title = title;
  }
  if (author) {
    res.book.author = author;
  }
  if (genre) {
    res.book.genre = genre;
  }
  if (publication_date) {
    res.book.publication_date = publication_date;
  }
  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getBook, async (req, res) => {
  try {
    await res.book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
