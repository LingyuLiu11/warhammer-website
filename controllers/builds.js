const Build = require('../models/build');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const builds = await Build.find({});
    res.render('builds/index', { builds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('builds/new');
}

module.exports.createBuild = async (req, res, next) => {
    const build = new Build(req.body.build);
    build.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    build.author = req.user._id;
    await build.save();
    console.log(build);
    req.flash('success', 'Successfully made a new build!');
    res.redirect(`/builds/${build._id}`)
}

module.exports.showBuild = async (req, res,) => {
    const build = await Build.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!build) {
        req.flash('error', 'Cannot find that build!');
        return res.redirect('/builds');
    }
    res.render('builds/show', { build });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const build = await Build.findById(id)
    if (!build) {
        req.flash('error', 'Cannot find that build!');
        return res.redirect('/builds');
    }
    res.render('builds/edit', { build });
}

module.exports.updateBuild = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const build = await Build.findByIdAndUpdate(id, { ...req.body.build });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    build.images.push(...imgs);
    await build.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await Build.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated build!');
    res.redirect(`/builds/${build._id}`)
}

module.exports.deleteBuild = async (req, res) => {
    const { id } = req.params;
    await Build.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted build')
    res.redirect('/builds');
}

