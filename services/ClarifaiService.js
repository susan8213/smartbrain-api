const Clarifai = require("clarifai");

const FaceApp = new Clarifai.App({
  apiKey: "051ff981dbdc4ffeb04e0926719704ab"
});

exports.detect = async (req, res) => {
  const { url } = req.body;
  try {
    const result = await FaceApp.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      url
    );
    return res.json(result);
  } catch (err) {
    const response = err.response;
    const status = response.status || 500;
    return res.status(status).json(response.data);
  }
};
