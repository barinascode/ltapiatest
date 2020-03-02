const MongoClient = require('mongodb').MongoClient;
const coursesData = require('../coursesData');


	const uri = "mongodb+srv://ltapia:20409949@cluster0-sbdbj.mongodb.net/test?retryWrites=true&w=majority";
	var mongoOptions = {
		useNewUrlParser: true, 
		useUnifiedTopology: true
	}



	/*
	*	Filter function
	*/
	function filterCurses(req, res){
			
		client = new MongoClient(uri, mongoOptions);

		let filters ={
			maximumCredits : (req.query.minCredits) ? req.query.minCredits : 0,
			rating : (req.query.minStars) ? req.query.minStars : 0 ,
			price : (req.query.minCost) ? req.query.minCost : 0
		}

		client.connect(err => {
			
			console.log(filters)
			const result = client.db('test').collection('courses').find({
				maximumCredits : { $gte: parseFloat(filters.maximumCredits) },
				rating : { $gte: parseFloat(filters.rating) },
				price : { $gte: parseFloat(filters.price) }
			}).toArray()

			result.then((data)=>{
				res.json(data)
			})

		});
	}



	/*
	*	Populate collection function
	*/
	function pupulateData(req, res){

		client = new MongoClient(uri, mongoOptions);

		client.connect(err => {
			const result =  client.db('test').collection('courses').countDocuments()
			const collection = client.db('test').collection('courses');

			result.then((total)=>{
				if(!total){
					collection.insertMany(coursesData);
					res.send(`success`)
				}else{
					res.send(`error, the data has already been inserted`)
				}
				
				client.close();
			})
			.catch((err)=>{
				console.log(err)
			}) 
		});
	}


	module.exports = {
		filterCurses,
		pupulateData
	};