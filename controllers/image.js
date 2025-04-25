const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + process.env.CLARIFAI_API);

const handleApiCall = (req, res) => {
    console.log('face detecion API hit:', req.body);
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
                console.error("Clarifai API error:", err);
                return res.status(400).json("Unable to work with API");
            }

            if (response.status.code !== 10000) {
                console.error("Clarifai API failed status:", response.status);
                return res.status(400).json("Clarifai API failure");
            }
            console.log("Clarifai API success:", response.outputs[0].data);
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

