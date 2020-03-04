const notesCtrl = {};
const note = require('../models/note');

notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/new-note');
};

notesCtrl.createNewNote = async (req, res) => {
    const { title, description } =req.body;
    const newnote = new note({title, description});
    newnote.user = req.user.id;
    await newnote.save();
    req.flash('success_msg', 'Note Added Successfuly');
    res.redirect('/notes');
};

notesCtrl.renderNotes = async (req, res) => {
    const notes = await note.find({user: req.user.id}).sort({createdAt: 'desc'});
    res.render('notes/all-notes', { notes });
};

notesCtrl.renderEditForm = async (req, res) => {
    const Note = await note.findById(req.params.id);
    if (note.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', { Note });
};

notesCtrl.updateNote = async (req, res) => {
    const { title, description } = req.body;
    await note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Update Successfuly');
    res.redirect('/notes');
};

notesCtrl.deleteNote = async (req, res) => {
    await note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfuly');
    res.redirect('/notes');
};

module.exports= notesCtrl;