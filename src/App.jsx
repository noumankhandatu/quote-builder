import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Textarea from "@mui/joy/Textarea";
import Loader from "./components/loader";
import SendIcon from "@mui/icons-material/Send";
import Typist from "react-text-typist";
import HelpIcon from "@mui/icons-material/Help";
import "react-toastify/dist/ReactToastify.css";

const VITE_OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
const token = VITE_OPENAI_KEY;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

function App() {
  const [loading, setLoading] = useState(false);
  const [ApiData, setApiData] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    areaParty: "",
    topic: "",
    newsArticleUrls: "",
    ideaMessage: "",
    sampleQuote: "",
  });

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    toast("The request may take a min please wait");
    const {
      fullName,
      areaParty,
      topic,
      newsArticleUrls,
      ideaMessage,
      sampleQuote,
    } = formData;
    if (!fullName || !areaParty || !topic) {
      return alert("please add all fields");
    }
    // api hit
    const response = await axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `I want you to imagine you are a press secretary, writing some quotes for ${fullName} for ${areaParty}. You should be an expert in political communications.  I am going to give you some example quotes. Pay attention to the writing style and structure of the quotes, taking into account the number of paragraphs used, length of writing, and number, length and position of quotations. Here are the sample quotes:  ${
                sampleQuote ? sampleQuote : "quote"
              }. I want you to draft some original quotes, about the following topic  ${topic}. Here are news articles for reference about the topic: ${newsArticleUrls} .The quotes should be written in exactly the same writing style and structure as the example, taking into account the number of paragraphs used, length of writing, and number, length and position of quotations used, which you should have noted previously. Here are the key ideas: ${ideaMessage}                                                                                                                                                                                                                                                                 
              }`,
            },
          ],
        },
        { headers }
      )
      .catch((err) => {
        toast.error("Please try again or contact developer");
        setLoading(false);
        console.log(err);
      });
    if (response && response?.data?.choices) {
      toast.success("Request Completed");
      setLoading(false);
      setApiData(response?.data?.choices[0]?.message?.content);
    }
    if (!response) {
      toast.warn("Please Try Again Later");
    }
  };

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <div className="test">
      <ToastContainer />
      {ApiData && ApiData !== "" ? (
        <Box className="Box">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              width={"200px"}
              src="https://next3-assets.s3.amazonaws.com/journeys/18/description_backgrounds-1423860386-writing_intro.gif"
              alt=""
            />
          </Box>
          <div style={{ marginTop: "50px" }}>
            <h1>Quote Generated :</h1>
            <br />
            <Typist
              typingSpeed={10}
              showCursor={false}
              sentences={[ApiData]}
              loop={false}
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "18px",
                letterSpacing: 2,
              }}
            />
          </div>
          <Button
            onClick={handleBack}
            sx={{ mt: 3 }}
            variant="contained"
            color="secondary"
            endIcon={<HelpIcon />}
          >
            <b> Try Another Quote </b>
          </Button>
        </Box>
      ) : (
        <Box className="Box">
          <div>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              Quote Builder
            </Typography>

            <Box sx={{ mt: 4 }} />
          </div>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Full Name"
              variant="outlined"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              sx={{ mt: 3 }}
              label="Area/Party"
              variant="outlined"
              name="areaParty"
              value={formData.areaParty}
              onChange={handleChange}
              required
            />

            <TextField
              sx={{ mt: 3 }}
              label="Topic"
              variant="outlined"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
            />
            <TextField
              sx={{ mt: 3 }}
              label="Links to News Articles (optional)"
              variant="outlined"
              name="newsArticleUrls"
              value={formData.newsArticleUrls}
              onChange={handleChange}
            />
            <TextField
              sx={{ mt: 3 }}
              label="Idea/Key Message (optional)"
              variant="outlined"
              name="ideaMessage"
              value={formData.ideaMessage}
              onChange={handleChange}
            />
            <Textarea
              value={formData.sampleQuote}
              onChange={handleChange}
              name="sampleQuote"
              sx={{ mt: 3 }}
              minRows={5}
              placeholder="Sample Quote (optional)"
              size="lg"
            />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Loader />
              </Box>
            ) : (
              <Button
                className="generate-button"
                sx={{ mt: 3 }}
                variant="contained"
                color="warning"
                type="submit"
                endIcon={<SendIcon fontSize="large" />}
              >
                <b> Generate Quote </b>
              </Button>
            )}
          </form>
        </Box>
      )}
    </div>
  );
}

export default App;
