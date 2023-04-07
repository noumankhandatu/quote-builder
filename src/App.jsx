import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Textarea from "@mui/joy/Textarea";
import Loader from "./components/loader";
import SendIcon from "@mui/icons-material/Send";
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
    constituency: "",
    topic: "",
    newsArticleUrls: "",
    notes: "",
    dummyRelease: "",
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
      constituency,
      topic,
      newsArticleUrls,
      notes,
      dummyRelease,
    } = formData;
    if (!fullName || !constituency || !topic) {
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
              content: `I want you to imagine you are a press secretary, writing a press release for ${fullName} for ${constituency} Consitution Constituency. You should be an expert in political communications.Topic: ${topic}\nLinks to News Articles: ${newsArticleUrls}\nNotes: ${notes}\n\nWrite a Press Release. Structure of Press Release will be like this: ${
                dummyRelease ? dummyRelease : "press release"
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

  const boldGPTDATA = ApiData.replace(/#|(Outline)/g, "").replace(
    /(Outline|FOR IMMEDIATE RELEASE)/g,
    "<strong>$1</strong>"
  );

  return (
    <div className="test">
      <ToastContainer />
      {ApiData && ApiData !== "" ? (
        <Box className="Box">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              width={"300px"}
              src="https://writofy.com/wp-content/uploads/2021/08/Press-Release.gif"
              alt=""
            />
          </Box>
          <div style={{ marginTop: "50px" }}>
            <div
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "18px",
                letterSpacing: 2,
              }}
              dangerouslySetInnerHTML={{ __html: boldGPTDATA }}
            />
          </div>
          <Button
            onClick={handleBack}
            sx={{ mt: 3 }}
            variant="contained"
            color="warning"
          >
            Generate Another
          </Button>
        </Box>
      ) : (
        <Box className="Box">
          <div>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              Press Release Generator
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
              label="Constituency"
              variant="outlined"
              name="constituency"
              value={formData.constituency}
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
              label="Notes (optional)"
              variant="outlined"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
            <Textarea
              value={formData.dummyRelease}
              onChange={handleChange}
              name="dummyRelease"
              sx={{ mt: 3 }}
              minRows={5}
              placeholder="Submit your example press release (optional)"
              size="lg"
            />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Loader />
              </Box>
            ) : (
              <Button
                className="generate-button"
                sx={{ mt: 3, backgroundColor: "#3577D2" }}
                variant="contained"
                color="secondary"
                type="submit"
                endIcon={<SendIcon fontSize="large" />}
              >
                Generate Press Release
              </Button>
            )}
          </form>
        </Box>
      )}
    </div>
  );
}

export default App;
