const Question = require('../schemas/questions');

// in request body you will get a search term, page no and some tags, write code to give me the questions for the particular query
const searchQuestion = async (req, res) => {
    const {searchTerm, page , tags} = req.body;

    const allTags = [
    'Maths', 'Physics', 'Chemistry', 'Mechanical', 'Electrical', 'Civil', 'Computer Science',
    'Electronics', 'Information Technology', 'Chemical Engineering', 'Biotechnology',
    'Aerospace Engineering', 'Materials Science', 'Data Science', 'Artificial Intelligence'
  ]

  const queryTags = (tags.length === 0 ? allTags: tags);

    const searchQuery = {
        question : {$regex: searchTerm, $options:"i"},
        tags : {$in: queryTags}
    }


     try{
        const reqQuestions = await Question.find(searchQuery)
        .skip(10*page)
        .limit(10)

        res.status(200).json(reqQuestions);
     }
     catch(err){
        console.log(err);
        res.status(505).json(err);
     }

};

module.exports = {searchQuestion};
