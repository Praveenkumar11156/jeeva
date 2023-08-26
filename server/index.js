const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/fileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const personSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Email: String,
  MobileNo: String,
  PermanentAddress: String
});

const schoolSchema = new mongoose.Schema({
  School: String,
  Board: String,
  Percentage: Number,
  Year: Number,
  Location: String,
});

const collegeSchema = new mongoose.Schema({
  College: String,
	Department: String,
	Percentage: Number,
	Year: Number,
	Location: String,
});

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const Person = mongoose.model('Person', personSchema);
const School = mongoose.model('School', schoolSchema);
const College = mongoose.model('College', collegeSchema);
const File = mongoose.model('File', fileSchema);

app.post('/addPerson', async (req, res) => {
  try {
    console.log(req.body)
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
      res.status(500).json({ error: 'Failed to add person.' });
  }
});

app.get('/getPerson', async (req, res) => {
  try {
      const people = await Person.find();
      res.json(people);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve people.' });
  }
});

// Add a new school entry
app.post('/addSchool', async (req, res) => {
  try {
    const newSchool = new School(req.body);
    const savedSchool = await newSchool.save();
    res.json(savedSchool);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add school.' });
  }
});

// Get all schools
app.get('/getSchools', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve schools.' });
  }
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB limit
  },
});

// Add a new College entry
app.post('/addCollege', async (req, res) => {
  try {
    const newCollege = new College(req.body);
    const savedCollege = await newCollege.save();
    res.json(savedCollege);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add College.'});
  }
})

//Get all Colleges
app.get('/getColleges', async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Colleges'})
  }
})

app.post('/upload', upload.single('file'), async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  const file = new File({
    filename: originalname,
    contentType: mimetype,
    data: buffer,
  });

  try {
    await file.save();
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await File.find({}, 'filename'); 
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await File.findOne({ filename });

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Server Error');
  }
});


app.delete('/delete/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const deletedFile = await File.findOneAndDelete({ filename });

    if (!deletedFile) {
      return res.status(404).send('File not found');
    }

    res.status(200).send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Server Error');
  }
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
