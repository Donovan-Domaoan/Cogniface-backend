const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const databaseClarifaiApi = process.env.CLARIFAI_API

const metadata = new grpc.Metadata();
metadata.set("authorization", {databaseClarifaiApi});

const handleApiCall = (req, res) => {
    const { input } = req.body;

    stub.PostModelOutputs(
        {
            model_id: "face-detection",
            user_app_id: {
                user_id: "donovandomaoan",
                app_id: "face-recognize"
            },
            inputs: [
                {
                    data: {
                        image: {
                            url: input
                        }
                    }
                }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                return res.status(400).json("API error: " + err);
            }

            if (response.status.code !== 10000) {
                return res.status(400).json("Clarifai failure: " + response.status.description);
            }

            res.json(response); 
        }
    );
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("*")
        .then(users => {
            if (users.length) {
                res.json(users[0].entries);
            } else {
                res.status(400).json('unable to display user')
            }
        })
        .catch(err => res.status(400).json("unable to get entries count"));
};

module.exports = {
    handleApiCall,
    handleImage
};

